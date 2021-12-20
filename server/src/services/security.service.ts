import {
    createDecipheriv,
    randomBytes,
    createCipheriv,
} from 'crypto';

import {Injectable, Logger} from '@nestjs/common';
import {verify, sign} from 'jsonwebtoken';
import axios from 'axios';

/**
 * A Security wrapper
 */
@Injectable()
export class SecurityService {
    private readonly logger = new Logger(SecurityService.name);
    private trelloPublicKeys: string;
    private trelloKeysExiry: number;
    private readonly blockSize: number = 16;

    /**
   * Fetches jwt keys exposed by Trello
   *
   * @returns A \n separated string of Trello's jwts
   */
    private async getTrelloKeys() {
        if (!this.trelloPublicKeys || this.trelloKeysExiry < Date.now()) {
            this.logger.debug('Fetching new Trello public keys');
            const resp = await axios.get(
                'https://api.trello.com/1/resource/jwt-public-keys',
            );
            this.trelloPublicKeys = resp.data.keys;
            this.trelloKeysExiry = Date.now() + 14400000;
        }
        this.logger.debug('Using existing Trello public keys');

        return this.trelloPublicKeys;
    }

    /**
   * AES CBC Encryption
   *
   * @param text
   * @param key
   * @returns
   */
    public encrypt(text: string, key: string): string {
        if (key.length !== this.blockSize * 2) {
            throw new Error('Invalid key length');
        }
        this.logger.debug('Trying to encrypt a new buffer');
        const iv = randomBytes(this.blockSize);
        const cipher = createCipheriv('aes-256-cbc', key, iv);
        let cipherText;
        try {
            cipherText = cipher.update(text, 'utf8', 'hex');
            cipherText += cipher.final('hex');
            cipherText = iv.toString('hex') + cipherText;
        } catch (e) {
            cipherText = null;
        }
        return cipherText;
    }

    /**
   * AES CBC Decryption
   *
   * @param text
   * @param key
   * @returns
   */
    public decrypt(text: string, key: string): string {
        if (key.length !== this.blockSize * 2) {
            throw new Error('Invalid key or iv format');
        }
        const contents = Buffer.from(text, 'hex');
        const iv = contents.slice(0, this.blockSize);
        const textBytes = contents.slice(this.blockSize).toString('hex');

        const decipher = createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(textBytes, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    /**
   * Fetches Trello's jwts and verifies the validity of the token specified
   *
   * @param token A jwt
   * @returns void or throws a validation error
   */
    public async verifyTrello(token: string) {
        this.logger.debug('Trying to verify a trello type token');
        const publicKeys = await this.getTrelloKeys();
        const errors = [];
        for (const key of publicKeys) {
            try {
                const decoded = verify(token, key);
                return JSON.parse((decoded as any).state);
            } catch (err) {
                errors.push(err);
            }
        }

        this.logger.error(errors[0]);
        throw errors[0];
    }

    /**
   * Issues a jwt token
   *
   * @param data An object to sign
   * @param secret A signature
   * @param exp An optional parameter to set expiration date
   * @returns A jwt token
   */
    public sign(data: Object, secret: string, exp?: number): string {
        this.logger.debug('Issuing a new token');
        return exp ? sign(data, secret, {
            expiresIn: exp,
        }) : sign(data, secret);
    }

    /**
   * Attempts to verify a jwt
   *
   * @param token A jwt to verify
   * @param secret A jwt's signature secret
   * @returns The decoded version of the jwt passed or throws a validation error
   */
    public async verify(token: string, secret: string) {
        this.logger.debug('Trying to verify a token');
        try {
            const decoded = verify(token, secret) as any;
            return decoded;
        } catch (err) {
            throw new Error(err);
        }
    }
}
