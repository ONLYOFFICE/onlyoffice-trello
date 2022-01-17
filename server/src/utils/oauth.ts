import axios from 'axios';
import {createHmac} from 'crypto';

import {Injectable} from '@nestjs/common';
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
                key: process.env.POWERUP_APP_KEY || 'key',
                secret: process.env.POWERUP_APP_SECRET || 'secret',
            },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return createHmac('sha1', key).update(base_string).digest('base64');
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
    public async getMe(url: string, token: string) {
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
