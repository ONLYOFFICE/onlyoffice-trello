import axios from 'axios';
import {Injectable, Logger} from '@nestjs/common';
import * as FormData from 'form-data';
import * as mime from 'mime-types';

import {RegistryService} from '@services/registry.service';

import {OAuthUtil} from '@utils/oauth';
import {Constants} from '@utils/const';

import {Callback, DocKeySession} from '@models/callback';
import {CallbackHandler} from '@models/interfaces/handlers';
import { FileUtils } from '@utils/file';
import { EventService } from '@services/event.service';

/**
 * Status 2 callback handler
 */
@Injectable()
export class ConventionalSaveCallbackHandler implements CallbackHandler {
    private readonly logger = new Logger(ConventionalSaveCallbackHandler.name);
    id: string =
        new Date().getTime().toString() + ConventionalSaveCallbackHandler.name;

    constructor(
        private readonly registry: RegistryService,
        private readonly eventService: EventService,
        private readonly oauthUtil: OAuthUtil,
        private readonly fileUtils: FileUtils,
        private readonly constants: Constants,
    ) {
        this.registry.subscribe(this);
    }

    /**
   *
   * @param callback
   * @param payload
   * @returns
   */
    async handle(callback: Callback, token: string, session: DocKeySession) {
        if (!callback.url || callback.status !== 2) {
            return;
        }

        this.logger.debug(`Trying to save ${session.File} changes`);
        this.eventService.emit(session.Attachment);

        const response = await axios({
            url: callback.url!,
            method: 'GET',
            responseType: 'stream',
        });

        const r = {
            url: `${this.constants.URL_TRELLO_API_BASE}/cards/${session.Card}/attachments`,
            method: 'POST',
        };

        const authHeader = this.oauthUtil.getAuthHeaderForRequest(r, token);
        const formData = new FormData();
        formData.append('file', response.data, {
            filename: session.File,
            contentType: mime.contentType(this.fileUtils.getFileExtension(session.File)) as string,
            knownLength: response.data?.length,
        });
        formData.submit(
            {
                host: 'api.trello.com',
                protocol: 'https:',
                path: `/1/cards/${session.Card}/attachments`,
                headers: {
                    Authorization: authHeader.Authorization,
                },
            },
            (err) => {
                if (err) {
                    this.logger.error(`[${session.File}]: ${err}`);
                }
            },
        );
    }
}
