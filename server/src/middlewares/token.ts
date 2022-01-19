/* eslint-disable max-classes-per-file */
import { NextFunction, Request, Response } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { SecurityService } from '@services/security.service';

import { Constants } from '@utils/const';

/**
 * Middlewares to verify requests from Trello's client.
 */
@Injectable()
export class TokenEditorVerificationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(TokenEditorVerificationMiddleware.name);

    constructor(
        private readonly securityService: SecurityService,
        private readonly constants: Constants,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
      this.logger.debug("Trying to verify a trello client's token");
      const signature = req.query.signature as string;
      try {
        const sig = await this.securityService.verifyTrello(signature);
        if (sig.due <= Number(new Date())) {
          throw new Error('Token has expired');
        }
        res.set(this.constants.HEADER_ONLYOFFICE_DOC_KEY, sig.docKey);
        this.logger.debug('OK');
        next();
      } catch (err) {
        this.logger.debug(err);
        res.status(403);
        res.send({ error: 1 }).end();
      }
    }
}

@Injectable()
export class TokenSettingsVerificationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(TokenSettingsVerificationMiddleware.name);

    constructor(
        private readonly securityService: SecurityService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
      this.logger.debug("Trying to verify a trello client's token");
      const signature = req.query.signature as string;
      try {
        const sig = await this.securityService.verifyTrello(signature);
        if (sig.due <= Number(new Date())) {
          throw new Error('Token has expired');
        }
        this.logger.debug('OK');
        next();
      } catch (err) {
        this.logger.debug(err);
        res.status(403);
        res.send({ error: 1 }).end();
      }
    }
}
