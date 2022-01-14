import {
    Body,
    Controller,
    Logger,
    Post,
    Query,
    Req,
    Res,
    Sse,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {Throttle} from '@nestjs/throttler';
import {Request, Response} from 'express';
import {validate} from 'class-validator';

import {SecurityService} from '@services/security.service';
import {Constants} from '@utils/const';
import {OAuthUtil} from '@utils/oauth';
import {Callback, DocKeySession} from '@models/callback';
import {
    EditorPayload,
    EditorPayloadForm,
    ProxyPayloadSecret,
} from '@models/payload';
import {Config} from '@models/config';
import {RegistryService} from '@services/registry.service';
import {CacheService} from '@services/cache.service';
import {ValidatorUtils} from '@utils/validation';
import {FileUtils} from '@utils/file';
import { Observable } from 'rxjs';
import { EventService } from '@services/event.service';

/**
 * Onlyoffice controller is responsible for managing users interaction with document servers
 */
@Controller({path: OnlyofficeController.baseRoute})
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
    @Throttle(4, 1)
    async callback(
        @Query('token') encToken: string,
        @Query('session') encSession: string,
        @Body() callback: Callback,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        this.logger.debug(`A new callback call with status ${callback.status}`);
        const session = JSON.parse(Buffer.from(encSession, 'base64url').toString('ascii')) as DocKeySession;
        try {
            const token = this.securityService.decrypt(encToken, process.env.POWERUP_APP_ENCRYPTION_KEY);

            session.Secret = this.securityService.decrypt(session.Secret, process.env.POWERUP_APP_ENCRYPTION_KEY);

            const dsToken = (
                req.headers[session.Header.toLowerCase()] as string
            ).split('Bearer ')[1];

            await this.securityService.verify(dsToken, session.Secret);

            this.registryService.run(callback, token, session);

            res.status(200);
            res.send({error: 0});
        } catch (err) {
            this.logger.error(err);
            res.status(403);
            res.send({error: 1});
        }
    }

    @Sse('events')
    events(): Observable<any> {
        return this.eventService.subscribe();
    }

    @Post('editor')
    @UsePipes(new ValidationPipe())
    async openEditor(@Body() form: EditorPayloadForm, @Res() res: Response) {
        try {
            const documentKey = res.getHeader(this.constants.HEADER_ONLYOFFICE_DOC_KEY).toString();
            if (!documentKey) throw new Error('Malformed document key');
            const payload = Object.setPrototypeOf(
                JSON.parse(form.payload),
                EditorPayload.prototype,
            ) as EditorPayload;
            const secret = this.securityService.decrypt(payload.dsjwt, process.env.POWERUP_APP_ENCRYPTION_KEY);
            await this.validationUtils.validateEditorPayload(payload);

            const fileUrl = this.fileUtils.buildTrelloFileUrl(payload);

            await this.validationUtils.validateFileSize(fileUrl, payload.token);

            if (!payload.proxySecret) {
                payload.proxySecret = this.getDefaultProxySecret(fileUrl, payload.token, secret);
            }

            const me = await this.oauthUtil.getMe(`${this.constants.URL_TRELLO_API_BASE}/members/me`, payload.token);

            if (!me.id || !me.username) throw new Error('Unknown user');

            // const docKey = await this.cacheManager.getDocKey(payload.attachment, payload.isEditable);

            const session: DocKeySession = {
                Address: payload.ds,
                Header: payload.dsheader,
                Secret: payload.dsjwt,
                Attachment: payload.attachment,
                File: payload.filename,
                Card: payload.card,
            };
            const encSession = Buffer.from(JSON.stringify(session)).toString('base64url');
            const encToken = this.securityService.encrypt(payload.token, process.env.POWERUP_APP_ENCRYPTION_KEY);

            const config: Config = {
                document: {
                    fileType: payload.fileExtension,
                    key: documentKey,
                    title: payload.filename,
                    url: `${process.env.PROXY_ADDRESS}/proxy?secret=${payload.proxySecret}&resource=${payload.proxyResource}`,
                },
                editorConfig: {
                    callbackUrl: `${process.env.SERVER_HOST}${OnlyofficeController.baseRoute}/callback?token=${encToken}&session=${encSession}`,
                    user: {
                        id: me.id,
                        name: me.username,
                    },
                    mode: payload.isEditable ? 'edit' : 'view',
                },
                attachment: payload.attachment
            };

            config.token = this.securityService.sign(config, secret);

            res.status(200);
            res.render('editor', {
                apijs: `${payload.ds}web-apps/apps/api/documents/api.js`,
                config: JSON.stringify(config),
            });
        } catch (err) {
            this.logger.debug(err);
            res.setHeader('X-ONLYOFFICE-REASON', err);
            res.render('error');
        }
    }
}
