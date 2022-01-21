import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import {
  Controller, Logger, Res, Post, Body, Req,
} from '@nestjs/common';

import { SecurityService } from '@services/security.service';

type EncryptionPayload = {
    secret: string,
};

@Controller({ path: SettingsController.baseRoute })
export class SettingsController {
    private readonly logger = new Logger(SettingsController.name);

    public static readonly baseRoute = '/onlyoffice/settings';

    constructor(
        private securityService: SecurityService,
    ) {}

    @Post()
    @Throttle(1000, 1)
    async encryptDocumentServerSecret(
        @Body() payload: EncryptionPayload,
        @Req() _: Request,
        @Res() res: Response,
    ) {
      this.logger.debug('A new callback call to encrypt ds jwt secret');
      try {
        const encryptedKey = this.securityService
          .encrypt(payload.secret, process.env.POWERUP_APP_ENCRYPTION_KEY);
        if (!encryptedKey) throw new Error('payload encryption error');
        res.status(200);
        res.send(encryptedKey);
      } catch (err) {
        this.logger.error(err);
        res.status(400).end();
      }
    }
}
