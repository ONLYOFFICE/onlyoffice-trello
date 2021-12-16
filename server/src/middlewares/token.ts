import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { SecurityService } from '@services/security.service';
import { NextFunction, Request, Response } from 'express';

/**
 * A Middleware to verify requests from Trello's client.
 */
@Injectable()
export class TokenVerificationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenVerificationMiddleware.name);

  constructor(
    private readonly securityService: SecurityService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("Trying to verify a trello client's token");
    const signature = req.query.signature as string;
    try {
      const sig = await this.securityService.verifyTrello(signature);
      if (sig.due <= +new Date()) throw new Error('Token has expired');
      this.logger.debug('OK');
      next();
    } catch (err) {
      this.logger.error(err);
      res.status(403);
      res.send({ error: 1 }).end();
    }
  }
}
