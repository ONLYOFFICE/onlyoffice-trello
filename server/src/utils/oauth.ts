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
import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import * as OAuth from 'oauth-1.0a';

/**
 * A fairly handy wrapper to handle OAuth-1.0
 */
@Injectable()
export class OAuthUtil {
  /**
   *
   * @param request A request options with both url and HTTP method
   * @param token A user's trello OAuth-1.0 token
   * @returns An OAuth-1.0 header
   */
  public getAuthHeaderForRequest(request: OAuth.RequestOptions, token: string) {
    const oauth = new OAuth({
      consumer: {
        key: process.env.POWERUP_APP_KEY,
        secret: process.env.POWERUP_APP_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return createHmac('sha1', key).update(baseString).digest('base64');
      },
    });

    const authorization = oauth.authorize(request, {
      key: token,
      secret: '',
    });

    return oauth.toHeader(authorization);
  }

  /**
     *
     * @param url
     * @param token
     * @returns
     */
  public async authorizedGet(url: string, token: string) {
    const request = {
      url,
      method: 'GET',
    };

    const header = this.getAuthHeaderForRequest(
      request,
      token,
    );

    const me = await axios.get(request.url, {
      headers: {
        Authorization: header.Authorization,
      },
      timeout: 1800,
    });

    return me.data;
  }
}
