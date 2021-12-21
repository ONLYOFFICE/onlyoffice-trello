import axios from 'axios';
import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Query,
    Req,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
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
import {Command} from '@models/command';
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

    @Post('callback')
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

            const dsToken = (
                req.headers[payload.dsheader.toLowerCase()] as string
            ).split('Bearer ')[1];

            await this.securityService.verify(dsToken, payload.dsjwt);

            await this.cacheManager.set(uid, spayload, 60 * 60 * 12);
            await this.cacheManager.set(`${this.constants.PREFIX_DOC_KEY_CACHE}_${id}`, callback.key, 60 * 60 * 12);

            this.registryService.run(callback, payload, uid);

            res.status(200);
            res.send({error: 0});
        } catch (err) {
            await this.cacheManager.del(uid);
            await this.cacheManager.del(`${this.constants.PREFIX_DOC_KEY_CACHE}_${id}`);
            this.logger.error(err);
            res.status(403);
            res.send({error: 1});
        }
    }

    @Get('ping')
    async getPing(@Res() res: Response) {
        res.send({
            ok: true,
        });
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
            const validationErr = await validate(payload);
            if (validationErr.length > 0) {
                throw new Error('Invalid form payload');
            }

            if (!this.validationUtils.validURL(payload.ds)) {
                throw new Error('Invalid document server url');
            }

            const fileExt = payload.filename.split('.')[1];
            const [fileSupported, fileEditable] =
        this.fileUtils.isExtensionSupported(fileExt);

            if (!fileSupported) {
                throw new Error('File type is not supported');
            }

            const attachmentUrl = `${this.constants.URL_TRELLO_API_BASE}/cards/${payload.card}/attachments/${payload.attachment}/download/${payload.filename}`;
            let authHeader = this.oauthUtil.getAuthHeaderForRequest(
                {
                    url: attachmentUrl,
                    method: 'HEAD',
                },
                payload.token,
            );

            const fileInfo = await axios.head(attachmentUrl, {
                headers: {
                    Authorization: authHeader.Authorization,
                },
            });

            const fileSize = parseFloat(fileInfo.headers['content-length']) / 1000000;
            if (fileSize > 1.6) {
                throw new Error('File size error');
            }

            const commandPayload: Command = {
                c: 'version',
            };

            const commandResponse = await axios.post(
                this.constants.getDocumentServerCommandUrl(payload.ds),
                commandPayload,
                {
                    headers: {
                        [payload.dsheader]: `Bearer ${this.securityService.sign(
                            commandPayload,
                            payload.dsjwt,
                            60 * 2,
                        )}`,
                    },
                },
            );

            if (!commandResponse.data.version) {
                throw new Error('No document server response');
            }

            if (!payload.proxySecret) {
                const request = {
                    url: attachmentUrl,
                    method: 'GET',
                };

                const authHeader = this.oauthUtil.getAuthHeaderForRequest(
                    request,
                    payload.token,
                );

                const secret: ProxyPayloadSecret = {
                    auth_value: authHeader.Authorization,
                    docs_jwt: payload.dsjwt,
                    due: (Number(new Date())) + 1000 * 80,
                };

                payload.proxySecret = this.securityService.encrypt(
                    JSON.stringify(secret),
                    process.env.PROXY_ENCRYPTION_KEY!,
                );
            }

            const request = {
                url: `${this.constants.URL_TRELLO_API_BASE}/members/me`,
                method: 'GET',
            };

            authHeader = this.oauthUtil.getAuthHeaderForRequest(
                request,
                payload.token,
            );

            const me = await axios.get(request.url, {
                headers: {
                    Authorization: authHeader.Authorization,
                },
            });

            let docKey = await this.cacheManager.get(
                `${this.constants.PREFIX_DOC_KEY_CACHE}_${payload.attachment}`,
            );

            if (!docKey) {
                docKey = new Date().getTime().toString();
                if (fileEditable) {
                    this.cacheManager.set(
                        `${this.constants.PREFIX_DOC_KEY_CACHE}_${payload.attachment}`,
                        docKey,
                        30,
                    );
                }
            }

            this.cacheManager.set(uid, form.payload, 30);

            const config: Config = {
                document: {
                    fileType: fileExt,
                    key: docKey,
                    title: payload.filename,
                    url: `${process.env.PROXY_ADDRESS}?secret=${payload.proxySecret}&resource=${payload.proxyResource}`,
                },
                editorConfig: {
                    callbackUrl: `${process.env.SERVER_HOST}${OnlyofficeController.baseRoute}/callback?uid=${uid}&id=${payload.attachment}`,
                    user: {
                        id: me.data?.id,
                        name: me.data?.username || 'Anonymous',
                    },
                    mode: fileEditable ? 'edit' : 'view',
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
