import {
  createDecipheriv,
  randomBytes,
  createCipheriv,
} from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';
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
        this.logger.debug('fetching new Trello public keys');
        const resp = await axios.get(
          'https://api.trello.com/1/resource/jwt-public-keys',
        );
        this.trelloPublicKeys = resp.data.keys;
        this.trelloKeysExiry = Date.now() + 14400000;
      }
      this.logger.debug('using existing Trello public keys');

      return this.trelloPublicKeys;
    }

    /**
   * AES GCM Encryption
   *
   * @param text
   * @param key
   * @returns
   */
    public encrypt(text: string, key: string): string {
      if (key.length !== this.blockSize * 2) {
        throw new Error(`invalid key length (expected: ${this.blockSize * 2})`);
      }
      const nonce = randomBytes(this.blockSize);
      const cipher = createCipheriv('aes-256-gcm', key, nonce);

      return Buffer.concat([nonce, cipher.update(text), cipher.final(), cipher.getAuthTag()]).toString('hex');
    }

    /**
   * AES GCM Decryption
   *
   * @param text
   * @param key
   * @returns
   */
    public decrypt(text: string, key: string): string {
      if (key.length !== this.blockSize * 2) {
        throw new Error(`invalid key or iv format (expected length: ${this.blockSize * 2})`);
      }
      const contents = Buffer.from(text, 'hex');
      const iv = contents.slice(0, this.blockSize);
      const textBytes = contents.slice(this.blockSize, contents.length - this.blockSize);
      const tag = contents.slice(contents.length - this.blockSize);

      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);

      return decipher.update(textBytes.toString('hex'), 'hex', 'utf8');
    }

    /**
   * Fetches Trello's jwts and verifies the validity of the token specified
   *
   * @param token A jwt
   * @returns void or throws a validation error
   */
    public async verifyTrello(token: string) {
      this.logger.debug('trying to verify a trello type token');
      const publicKeys = await this.getTrelloKeys();
      const errors = [];
      // eslint-disable-next-line no-restricted-syntax
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
      this.logger.debug('issuing a new token');
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
      this.logger.debug('trying to verify a token');
      try {
        const decoded = verify(token, secret) as any;
        return decoded;
      } catch (err) {
        throw new Error(err);
      }
    }
}
