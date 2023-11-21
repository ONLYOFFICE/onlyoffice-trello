/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import {
  Body,
  Controller,
  Logger,
  Post,
  Query,
  Req,
  Res,
  Sse,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { parse } from 'express-useragent';

import { DocumentServerThrottlerGuard } from '@guards/throttler';

import { SecurityService } from '@services/security.service';
import { RegistryService } from '@services/registry.service';
import { CacheService } from '@services/cache.service';
import { EventService } from '@services/event.service';

import { Constants } from '@utils/const';
import { OAuthUtil } from '@utils/oauth';
import { ValidatorUtils } from '@utils/validation';
import { FileUtils } from '@utils/file';

import {
  EditorPayload,
  EditorPayloadForm,
  ProxyPayloadSecret,
} from '@models/payload';
import { Callback, DocKeySession } from '@models/callback';
import { Config } from '@models/config';
import { DocumentServerSecret } from '@models/settings';

/**
 * ONLYOFFICE controller is responsible for managing users interaction with document servers
 */
@Controller({ path: OnlyofficeController.baseRoute })
export class OnlyofficeController {
    private readonly logger = new Logger(OnlyofficeController.name);

    public static readonly baseRoute = '/onlyoffice';

    constructor(
        private readonly cacheManager: CacheService,
        private securityService: SecurityService,
        private registryService: RegistryService,
        private eventService: EventService,
        private constants: Constants,
        private oauthUtil: OAuthUtil,
        private validationUtils: ValidatorUtils,
        private fileUtils: FileUtils,
    ) {}

    private getDefaultProxySecret(fileUrl: string, token: string, dsjwt: string): string {
      this.logger.debug('Default proxy secret generation');
      const header = this.oauthUtil.getAuthHeaderForRequest(
        { url: fileUrl, method: 'GET' },
        token,
      );
      const secret: ProxyPayloadSecret = {
        authValue: header.Authorization,
        docsJwt: dsjwt,
        due: (Number(new Date())) + 1000 * 80,
      };
      return this.securityService.encrypt(
        JSON.stringify(secret),
            process.env.PROXY_ENCRYPTION_KEY!,
      );
    }

    @Post('callback')
    @Throttle({ default: { limit: 30, ttl: 1 } })
    @UseGuards(DocumentServerThrottlerGuard)
    async callback(
        @Query('session') encSession: string,
        @Body() callback: Callback,
        @Req() req: Request,
        @Res() res: Response,
    ) {
      this.logger.debug(req.headers);
      let payload: Callback = callback;
      try {
        const session = await this.securityService
          .verify(encSession, process.env.POWERUP_APP_ENCRYPTION_KEY) as DocKeySession;

        session.Secret = await this.cacheManager.get(session.Secret) || this.securityService
          .decrypt(session.Secret, process.env.POWERUP_APP_ENCRYPTION_KEY);

        const authHeader = req.headers[session.Header.toLowerCase()];
        if (!authHeader && !callback.token) throw new Error('No authorization token');

        if (callback.token) {
          payload = await this.securityService.verify(callback.token, session.Secret) as Callback;
        }

        this.logger.debug(`A new callback (${payload.key}) call with status ${payload.status}`);

        if (!callback.token) {
          const dsToken = (authHeader as string)?.split('Bearer ')[1];
          await this.securityService.verify(dsToken, session.Secret);
        }

        this.registryService.run(payload, session);

        res.status(200);
        res.send({ error: 0 });
        this.logger.debug(`Callback (${payload.key}) has been processed without errors`);
      } catch (err) {
        this.logger.error(
          `Callback (${payload.key}) with status ${payload.status} has an error: ${err}`,
        );
        res.status(403);
        res.send({ error: 1 });
      }
    }

    @Sse('events')
    events(): Observable<any> {
      return this.eventService.subscribe();
    }

    @Post('editor')
    @UsePipes(new ValidationPipe())
    async openEditor(
      @Body() form: EditorPayloadForm,
      @Query('lang') lang: string,
      @Req() req: Request,
      @Res() res: Response,
    ) {
      try {
        this.logger.debug(`A new editor request: ${form.payload}`);
        this.logger.debug(req.headers);
        const source = req.headers['user-agent'];
        const ua = parse(source);
        const documentKey = res.getHeader(this.constants.HEADER_ONLYOFFICE_DOC_KEY).toString();
        if (!documentKey) throw new Error('malformed document key');
        const payload = Object.setPrototypeOf(
          JSON.parse(form.payload),
          EditorPayload.prototype,
        ) as EditorPayload;
        this.logger.debug("Trying to decrypt docs secret");
        const documentServerSecret = JSON.parse(this.securityService
          .decrypt(payload.dsjwt, process.env.POWERUP_APP_ENCRYPTION_KEY)) as DocumentServerSecret;
        this.logger.debug("Docs secret successfully decrypted");
        this.logger.debug("Validating editor payload");
        const validPayload = await this.validationUtils.validateEditorPayload(payload);
        this.logger.debug("Editor payload is valid");

        this.logger.debug("Building trello file url");
        const fileUrl = this.fileUtils.buildTrelloFileUrl(validPayload);
        this.logger.debug(`Trello file url ${fileUrl}`);

        this.logger.debug("Validating file size");
        await this.validationUtils.validateFileSize(fileUrl, validPayload.token);
        this.logger.debug("File size is valid")

        if (!validPayload.proxySecret) {
          validPayload.proxySecret = this
            .getDefaultProxySecret(fileUrl, validPayload.token, documentServerSecret.secret);
        }

        this.logger.debug("Trying to get me");
        const me = await this.oauthUtil.authorizedGet(`${this.constants.URL_TRELLO_API_BASE}/members/me`, validPayload.token);
        this.logger.debug(`Me: ${me}`);

        if (!me.id || !me.username) throw new Error('unknown user');

        const encryptedSecret = this.securityService
          .encrypt(documentServerSecret.secret, process.env.POWERUP_APP_ENCRYPTION_KEY);
        this.logger.debug("Trying to set encrypted secret");
        await this.cacheManager.set(encryptedSecret, documentServerSecret.secret);
        this.logger.debug("Encrypted secret is set");

        const encToken = this.securityService
          .encrypt(validPayload.token, process.env.POWERUP_APP_ENCRYPTION_KEY);

        const session: DocKeySession = {
          Address: validPayload.ds,
          Header: validPayload.dsheader,
          Secret: encryptedSecret,
          Token: encToken,
          Attachment: validPayload.attachment,
          File: encodeURI(validPayload.filename),
          Card: validPayload.card,
        };

        this.logger.debug("Signing enc session");
        const encSession = this.securityService
          .sign(session, process.env.POWERUP_APP_ENCRYPTION_KEY, 60 * 60 * 10);
        this.logger.debug("Enc session is signed");

        const config: Config = {
          type: ua.isMobile ? 'mobile' : 'desktop',
          document: {
            fileType: validPayload.fileExtension,
            key: documentKey,
            title: validPayload.filename,
            url: `${process.env.PROXY_ADDRESS}/proxy?secret=${validPayload.proxySecret}&resource=${validPayload.proxyResource}`,
          },
          editorConfig: {
            callbackUrl: `${process.env.SERVER_HOST}${OnlyofficeController.baseRoute}/callback?session=${encSession}`,
            user: {
              id: me.id,
              name: me.username,
            },
            mode: validPayload.isEditable && validPayload.isWriteMember ? 'edit' : 'view',
            lang,
          },
          attachment: validPayload.attachment,
        };

        this.logger.debug("Signing editor config");
        config.token = this.securityService.sign(config, documentServerSecret.secret);
        this.logger.debug(`Editor config has been signed: ${config.token}`);

        res.status(200);
        res.render('editor', {
          apijs: `${validPayload.ds}web-apps/apps/api/documents/api.js`,
          config: JSON.stringify(config),
        });
        this.logger.debug(`Now opening an editor session with fileID = ${payload.attachment} and key = ${documentKey}`);
      } catch (err) {
        this.logger.error(`An editor request had an error: ${err}`);
        res.setHeader('X-ONLYOFFICE-REASON', err);
        res.render('error');
      }
    }
}
