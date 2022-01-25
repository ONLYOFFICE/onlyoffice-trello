import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import {
  Controller, Logger, Res, Post, Body, Req,
} from '@nestjs/common';

import { SecurityService } from '@services/security.service';

import { Constants } from '@utils/const';

import { DocumentServerSecret, SettingsEncryptionPayload } from '@models/settings';

@Controller({ path: SettingsController.baseRoute })
export class SettingsController {
    private readonly logger = new Logger(SettingsController.name);

    public static readonly baseRoute = '/onlyoffice/settings';

    constructor(
        private securityService: SecurityService,
        private readonly constants: Constants,
    ) {}

    @Post('/encrypt')
    @Throttle(200, 1)
    async encryptDocumentServerSecret(
        @Body() payload: SettingsEncryptionPayload,
        @Req() _: Request,
        @Res() res: Response,
    ) {
      this.logger.debug('A new callback call to encrypt ds jwt secret');
      try {
        const orgID = res.getHeader(this.constants.HEADER_ONLYOFFICE_ORG_ID).toString();
        const secret: DocumentServerSecret = {
          secret: payload.secret,
          org: orgID,
        };
        const encryptedKey = this.securityService
          .encrypt(JSON.stringify(secret), process.env.POWERUP_APP_ENCRYPTION_KEY);
        if (!encryptedKey) throw new Error('payload encryption error');
        res.status(200)
          .send(encryptedKey);
      } catch (err) {
        this.logger.error(err);
        res.status(400).end();
      }
    }

    @Post('/decrypt')
    @Throttle(200, 1)
    async decryptDocumentServerSecret(
      @Body() payload: SettingsEncryptionPayload,
      @Req() _: Request,
      @Res() res: Response,
    ) {
      try {
        const orgID = res.getHeader(this.constants.HEADER_ONLYOFFICE_ORG_ID).toString();
        const decryptedPayload = JSON.parse(this.securityService
          .decrypt(payload.secret, process.env.POWERUP_APP_ENCRYPTION_KEY)) as DocumentServerSecret;

        if (!decryptedPayload.org || decryptedPayload.org !== orgID) {
          throw new Error(`no permissions to decrypt ${orgID}'s secret`);
        }

        res.status(200)
          .send(decryptedPayload.secret);
      } catch (err) {
        this.logger.error(err);
        res.status(400).end();
      }
    }
}
