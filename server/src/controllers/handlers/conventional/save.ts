import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import * as mime from 'mime-types';

import { Callback } from '@models/callback';
import { CallbackHandler } from '@models/interfaces/handlers';
import { EditorPayload } from '@models/payload';
import { RegistryService } from '@services/registry.service';
import { OAuthUtil } from '@utils/oauth';
import { RedisCacheService } from '@services/redis.service';
import { Constants } from '@utils/const';

/**
 * Status 2 callback handler
 */
@Injectable()
export class ConventionalSaveCallbackHandler implements CallbackHandler {
  private readonly logger = new Logger(ConventionalSaveCallbackHandler.name);
  id: string =
    new Date().getTime().toString() + ConventionalSaveCallbackHandler.name;

  constructor(
    private readonly cacheManager: RedisCacheService,
    private readonly registry: RegistryService,
    private readonly oauthUtil: OAuthUtil,
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
  async handle(callback: Callback, payload: EditorPayload, uid: string) {
    if (!callback.url || callback.status !== 2) return;

    this.logger.debug(`Trying to save ${payload.filename} changes`);

    const response = await axios({
      url: callback.url!,
      method: 'GET',
      responseType: 'stream',
    });

    const r = {
      url: `https://api.trello.com/1/cards/${payload.card}/attachments`,
      method: 'POST',
    };
    const authHeader = this.oauthUtil.getAuthHeaderForRequest(r, payload.token);
    const formData = new FormData();
    formData.append('file', response.data, {
      filename: payload.filename,
      contentType: mime.contentType(payload.filename.split('.')[1]) as string,
      knownLength: response.data?.length,
    });
    formData.submit(
      {
        host: 'api.trello.com',
        protocol: 'https:',
        path: `/1/cards/${payload.card}/attachments`,
        headers: {
          Authorization: authHeader.Authorization,
        },
      },
      (err) => {
        if (err) this.logger.error(`[${payload.filename}]: ${err}`);
      },
    );
    await this.cacheManager.del(`${this.constants.PREFIX_DOC_KEY_CACHE}_${payload.attachment}`);
    await this.cacheManager.del(uid);
  }
}
