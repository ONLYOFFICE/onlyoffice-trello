import axios from 'axios';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { FileController } from '@controllers/file.controller';
import { SecurityService } from '@services/security.service';
import { FileService } from '@services/file.service';
import { Constants } from '@utils/const';
import { OAuthUtil } from '@utils/oauth';
import { Callback } from '@models/callback';
import { RegistryService } from '@services/registry.service';
import { FilePayload } from '@models/payloads';
import { RedisCacheService } from '@services/redis.service';
import { ValidatorUtils } from '@utils/validation';

/**
 * Onlyoffice controller is responsible for managing users interaction with document servers
 */
@Controller({ path: OnlyofficeController.baseRoute })
export class OnlyofficeController {
  private readonly logger = new Logger(OnlyofficeController.name);
  public static readonly baseRoute = '/onlyoffice';

  constructor(
    private readonly cacheManager: RedisCacheService,
    private securityService: SecurityService,
    private registryService: RegistryService,
    private fileService: FileService,
    private constants: Constants,
    private oauthUtil: OAuthUtil,
    private validationUtils: ValidatorUtils,
  ) {}

  //TODO: Forward auth headers from the client
  @Post('callback')
  async callback(
    @Query('token') token: string,
    @Body() callback: Callback,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.debug(`A new callback call with status ${callback.status}`);
    try {
      let vjwt = JSON.parse(await this.cacheManager.get(token));
      if (!vjwt) {
        vjwt = await this.securityService.verifyTrello(token);
      }
      const payload = new FilePayload(
        vjwt.token,
        vjwt.card,
        vjwt.attachment,
        vjwt.filename,
      );
      this.logger.debug(req.headers);
      const dsToken = (req.headers[req.query.header.toString().toLowerCase()] as string).split('Bearer ')[1];
      const secret = req.query.secret as string || '';

      await this.securityService.verify(dsToken, secret);

      this.registryService.run(callback, payload);

      res.status(200);
      res.send({ error: 0 });
    } catch (err) {
      this.logger.error(err);
      res.status(403);
      res.send({ error: 1 });
    }
  }

  @Get('editor')
  @Render('editor')
  async openEditor(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers[this.constants.HEADER_TOKEN]!.toString();
      const attachment =
        req.headers[this.constants.HEADER_ATTACHMENT_ID]!.toString();
      const card = req.headers[this.constants.HEADER_CARD_ID]!.toString();
      const filename = req.headers[this.constants.HEADER_FILENAME]!.toString();
      const secret =
        req.headers[this.constants.HEADER_DOCSERVER_SECRET]!.toString();
      const ds = req.headers[this.constants.HEADER_DOCSERVER_URL]!.toString();
      const jwt = req.headers[this.constants.HEADER_RAW_JWT]!.toString();
      const header = req.headers[this.constants.HEADER_DOCSERVER_HEADERNAME]!.toString();

      if (!this.validationUtils.validURL(ds))
        throw new Error('Invalid document server url');

      let config = await this.securityService.verifyTrello(
        req.query.config as string,
      );

      const request = {
        url: `${this.constants.URL_TRELLO_API_BASE}/members/me`,
        method: 'GET',
      };

      const authHeader = this.oauthUtil.getAuthHeaderForRequest(request, token);

      const me = await axios.get(request.url, {
        headers: {
          Authorization: authHeader.Authorization,
        },
      });

      const downloadToken = this.constants.PREFIX_DOWNLOAD_TOKEN_CACHE + new Date().getTime().toString();
      await this.cacheManager.set(
        downloadToken,
        JSON.stringify({
          attachment: attachment,
          filename: filename,
        }),
        this.constants.SECURITY_INTERNAL_TOKENS_EXP,
      );

      let docKey = await this.cacheManager.get(`${this.constants.PREFIX_DOC_KEY_CACHE}_${attachment}`);

      if (!docKey) {
        docKey = new Date().getTime().toString();
        this.cacheManager.set(
          `${this.constants.PREFIX_DOC_KEY_CACHE}_${attachment}`,
          docKey,
        );
      }

      config = {
        document: {
          ...config.document,
          key: docKey,
          url: `${process.env.SERVER_HOST}${FileController.baseRoute}/download?token=${downloadToken}`,
        },
        editorConfig: {
          callbackUrl: `${process.env.SERVER_HOST}${OnlyofficeController.baseRoute}/callback?token=${jwt}&secret=${secret}&header=${header}`,
          user: {
            id: me.data?.id,
            name: me.data?.username || 'Anonymous',
          },
        },
      };

      if (secret) {
        const token = this.securityService.sign(config, secret);
        config = {
          ...config,
          token: token,
        };
      }

      if (!this.fileService.checkAttachment(attachment)) {
        this.logger.debug('No uploaded attachment');
        await this.cacheManager.set(
          `${this.constants.PREFIX_UPLOAD_CACHE}_${attachment}_${card}`,
          new Date().getTime().toString(),
          this.constants.SECURITY_INTERNAL_TOKENS_EXP,
        );
        await axios.get(
          `${process.env.SERVER_HOST}/api/v1/filemanager/upload`,
          {
            headers: {
              [this.constants.HEADER_TOKEN]: token,
              [this.constants.HEADER_ATTACHMENT_ID]: attachment,
              [this.constants.HEADER_CARD_ID]: card,
              [this.constants.HEADER_FILENAME]: filename,
            },
          },
        );
      }

      res.status(200);
      return {
        file: filename,
        attachment: attachment,
        apijs: `${ds}web-apps/apps/api/documents/api.js`,
        config: JSON.stringify(config),
      };
    } catch (err) {
      this.logger.error(err);
      res.status(403);
    }
  }
}
