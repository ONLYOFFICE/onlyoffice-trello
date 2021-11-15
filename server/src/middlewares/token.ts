import { FilePayload } from '@models/payloads';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { RedisCacheService } from '@services/redis.service';
import { SecurityService } from '@services/security.service';
import { Constants } from '@utils/const';
import { NextFunction, Request, Response } from 'express';

/**
 * A Middleware to check Trello users' tokens directly related to editing files (oauth token, ids, file name)
 */
@Injectable()
export class TokenVerificationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenVerificationMiddleware.name);

  constructor(
    private readonly constants: Constants,
    private readonly securityService: SecurityService,
    private readonly cacheManager: RedisCacheService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("Trying to verify a trello client's token");
    const tokenPayload = req.query.token as string;
    try {
      let tp = JSON.parse(await this.cacheManager.get(tokenPayload));

      if (!tp) {
        this.logger.debug('Cache has no token payload candidates');
        tp = await this.securityService.verifyTrello(tokenPayload);
      }

      const tpayload = new FilePayload(
        tp.token,
        tp.card,
        tp.attachment,
        tp.filename,
      );

      await this.cacheManager.set(tokenPayload, JSON.stringify(tp), 240);

      req.headers[this.constants.HEADER_TOKEN] = tpayload.token;
      req.headers[this.constants.HEADER_ATTACHMENT_ID] = tpayload.attachment;
      req.headers[this.constants.HEADER_CARD_ID] = tpayload.card;
      req.headers[this.constants.HEADER_FILENAME] = tpayload.filename;
      req.headers[this.constants.HEADER_RAW_JWT] = tokenPayload;

      this.logger.debug('OK');

      next();
    } catch (err) {
      this.logger.error(err);
      res.status(403);
      res.send({ error: 1 }).end();
    }
  }
}
