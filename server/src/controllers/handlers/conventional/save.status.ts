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

import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import * as mime from 'mime-types';

import { RegistryService } from '@services/registry.service';
import { EventService } from '@services/event.service';
import { SecurityService } from '@services/security.service';

import { OAuthUtil } from '@utils/oauth';
import { Constants } from '@utils/const';
import { FileUtils } from '@utils/file';

import { Callback, DocKeySession } from '@models/callback';
import { CallbackHandler } from '@models/interfaces/handlers';

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
        private readonly securityService: SecurityService,
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
    async handle(callback: Callback, session: DocKeySession) {
      if (!callback.url || callback.status !== 2) {
        return;
      }

      this.logger.debug(`Trying to save ${session.Attachment} changes`);
      this.logger.debug(`Sending a cleanup event for ${session.Attachment}`);
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

      const token = this.securityService
        .decrypt(session.Token, process.env.POWERUP_APP_ENCRYPTION_KEY);

      const authHeader = this.oauthUtil.getAuthHeaderForRequest(r, token);
      const formData = new FormData();
      formData.append('file', response.data, {
        filename: decodeURI(session.File),
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
            this.logger.error(`[${session.Attachment}]: ${err}`);
          }
        },
      );
    }
}
