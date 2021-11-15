import { FilestorePayload } from '@models/payloads';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { RedisCacheService } from '@services/redis.service';
import { Constants } from '@utils/const';
import { NextFunction, Request, Response } from 'express';

/**
 * A middleware to block any user from downloading files from the filestore (hub). Only document
 * servers are allowed to download files
 */
@Injectable()
export class DownloadVerificationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DownloadVerificationMiddleware.name);

  constructor(
    private readonly constants: Constants,
    private readonly cacheManager: RedisCacheService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.query.token as string;
    try {
      this.logger.debug('Running download verification middleware');
      const payload = JSON.parse(await this.cacheManager.get(token));
      const storePayload = new FilestorePayload(
        payload.attachment,
        payload.filename,
      );

      req.headers[this.constants.HEADER_ATTACHMENT_ID] =
        storePayload.attachment;
      req.headers[this.constants.HEADER_FILENAME] = storePayload.filename;

      this.cacheManager.del(token);

      next();
    } catch (err) {
      this.logger.error(err);
      res.status(403);
      res.send({ error: 1 }).end();
    }
  }
}
