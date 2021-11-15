import { Injectable } from '@nestjs/common';
import * as OAuth from 'oauth-1.0a';
import { createHmac } from 'crypto';

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
        key: process.env.POWERUP_APP_KEY!,
        secret: process.env.POWERUP_APP_SECRET!,
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
}
