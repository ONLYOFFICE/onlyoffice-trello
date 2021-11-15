import { Injectable, Logger } from '@nestjs/common';
import {
  generateKeyPairSync,
  publicEncrypt,
  constants,
  privateDecrypt,
} from 'crypto';
import { verify, sign } from 'jsonwebtoken';
import axios from 'axios';

/**
 * A Security wrapper
 */
@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  public readonly publicKey: string;
  private privateKey: string;
  private trelloPublicKeys: string;
  private trelloKeysExiry: number;

  /**
   * Generates an asymmetric key pair
   */
  constructor() {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

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
   * Buffer encryption with the public key
   *
   * @param data A buffer to encrypt
   * @returns An encrypted buffer
   */
  public encrypt(data: Buffer): Buffer {
    this.logger.debug('Trying to encrypt a new buffer');
    return publicEncrypt(
      {
        key: this.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      data,
    );
  }

  /**
   * Buffer to decrypt with the private key
   *
   * @param data An encrypted buffer
   * @returns A decrypted buffer
   */
  public decrypt(data: Buffer): string {
    this.logger.debug('Trying to decrypt a new buffer');
    return privateDecrypt(
      {
        key: this.privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      data,
    ).toString();
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
    for (let key of publicKeys) {
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
