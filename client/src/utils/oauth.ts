import OAuth from 'oauth-1.0a';
import createHmac from 'crypto-js/hmac-sha1';

export const generateOAuthHeader = (
    request: OAuth.RequestOptions,
    key: string, secret: string,
    token: string,
): OAuth.Header => {
    const oauth = new OAuth({
        consumer: {
            key,
            secret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return createHmac(base_string, key).toString();
        },
    });

    const authorization = oauth.authorize(request, {
        key: token,
        secret: '',
    });

    return oauth.toHeader(authorization);
};
