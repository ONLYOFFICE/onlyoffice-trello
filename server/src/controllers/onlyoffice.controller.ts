import {
    Body,
    Controller,
    Logger,
    Post,
    Query,
    Req,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {Throttle} from '@nestjs/throttler';
import {Request, Response} from 'express';
import {nanoid} from 'nanoid';
import {validate} from 'class-validator';

import {SecurityService} from '@services/security.service';
import {Constants} from '@utils/const';
import {OAuthUtil} from '@utils/oauth';
import {Callback} from '@models/callback';
import {
    EditorPayload,
    EditorPayloadForm,
    ProxyPayloadSecret,
} from '@models/payload';
import {Config} from '@models/config';
import {RegistryService} from '@services/registry.service';
import {RedisCacheService} from '@services/redis.service';
import {ValidatorUtils} from '@utils/validation';
import {FileUtils} from '@utils/file';

/**
 * Onlyoffice controller is responsible for managing users interaction with document servers
 */
@Controller({path: OnlyofficeController.baseRoute})
export class OnlyofficeController {
    private readonly logger = new Logger(OnlyofficeController.name);
    public static readonly baseRoute = '/onlyoffice';

    constructor(
        private readonly cacheManager: RedisCacheService,
        private securityService: SecurityService,
        private registryService: RegistryService,
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
            auth_value: header.Authorization,
            docs_jwt: dsjwt,
            due: (Number(new Date())) + 1000 * 80,
        };
        return this.securityService.encrypt(
            JSON.stringify(secret),
            process.env.PROXY_ENCRYPTION_KEY!,
        );
    }

    @Post('callback')
    @Throttle(6, 1)
    async callback(
        @Query('uid') uid: string,
        @Query('id') id: string,
        @Body() callback: Callback,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        this.logger.debug(`A new callback call with status ${callback.status}`);
        try {
            const spayload = await this.cacheManager.get(uid);
            const payload = Object.setPrototypeOf(
                JSON.parse(spayload),
                EditorPayload.prototype,
            ) as EditorPayload;
            const validationErr = await validate(payload);

            if (validationErr.length > 0) {
                throw new Error('Malformed payload');
            }

            // TODO: Custom headers
            const dsToken = (
                req.headers[payload.dsheader.toLowerCase()] as string
            ).split('Bearer ')[1];

            await this.securityService.verify(dsToken, payload.dsjwt);

            await this.cacheManager.set(uid, spayload, 60 * 60 * 12);
            await this.cacheManager.setDocKey(id, callback.key, 60 * 60 * 12);

            this.registryService.run(callback, payload, uid);

            res.status(200);
            res.send({error: 0});
        } catch (err) {
            await this.cacheManager.del(uid);
            await this.cacheManager.docKeyCleanup(id);
            this.logger.debug(err);
            res.status(403);
            res.send({error: 1});
        }
    }

    @Post('editor')
    @UsePipes(new ValidationPipe())
    async openEditor(@Body() form: EditorPayloadForm, @Res() res: Response) {
        const uid = nanoid();
        try {
            const payload = Object.setPrototypeOf(
                JSON.parse(form.payload),
                EditorPayload.prototype,
            ) as EditorPayload;
            payload.dsjwt = this.securityService.decrypt(payload.dsjwt, process.env.POWERUP_APP_ENCRYPTION_KEY);
            await this.validationUtils.validateEditorPayload(payload);

            const fileUrl = this.fileUtils.buildTrelloFileUrl(payload);

            await this.validationUtils.validateFileSize(fileUrl, payload.token);

            if (!payload.proxySecret) {
                payload.proxySecret = this.getDefaultProxySecret(fileUrl, payload.token, payload.dsjwt);
            }

            const me = await this.oauthUtil.getMe(`${this.constants.URL_TRELLO_API_BASE}/members/me`, payload.token);

            const docKey = await this.cacheManager.getDocKey(payload.attachment, payload.isEditable);

            this.cacheManager.set(uid, JSON.stringify(payload), 40);

            const config: Config = {
                document: {
                    fileType: payload.fileExtension,
                    key: docKey,
                    title: payload.filename,
                    url: `${process.env.PROXY_ADDRESS}?secret=${payload.proxySecret}&resource=${payload.proxyResource}`,
                },
                editorConfig: {
                    callbackUrl: `${process.env.SERVER_HOST}${OnlyofficeController.baseRoute}/callback?uid=${uid}&id=${payload.attachment}`,
                    user: {
                        id: me.id,
                        name: me.username || 'Anonymous',
                    },
                    mode: payload.isEditable ? 'edit' : 'view',
                },
            };

            config.token = this.securityService.sign(config, payload.dsjwt);

            res.status(200);
            res.render('editor', {
                file: payload.filename,
                attachment: payload.attachment,
                apijs: `${payload.ds}web-apps/apps/api/documents/api.js`,
                config: JSON.stringify(config),
            });
        } catch (err) {
            this.logger.debug(err);
            await this.cacheManager.del(uid);
            res.setHeader('X-ONLYOFFICE-REASON', err);
            res.render('error');
        }
    }
}
