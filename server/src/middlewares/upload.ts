import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { RedisCacheService } from '@services/redis.service';
import { Constants } from '@utils/const';
import { NextFunction, Request, Response } from 'express';

/**
 * A Middleware to check all necessary header before proceeding to uploading files
 */
@Injectable()
export class UploadVerificationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UploadVerificationMiddleware.name);

  constructor(
    private readonly constants: Constants,
    private readonly cacheManager: RedisCacheService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Running upload verification middleware');
    const token = req.header(this.constants.HEADER_TOKEN);
    const card = req.header(this.constants.HEADER_CARD_ID);
    const attachment = req.header(this.constants.HEADER_ATTACHMENT_ID);
    const filename = req.header(this.constants.HEADER_FILENAME);
    const cacheKey = `${this.constants.PREFIX_UPLOAD_CACHE}_${attachment}_${card}`;
    const isValid = await this.cacheManager.get(cacheKey);
    try {
      if (!token || !card || !attachment || !filename || !isValid)
        throw new Error('Invalid upload headers');
      this.cacheManager.del(cacheKey);
      next();
    } catch (err) {
      this.logger.error(err);
      res.status(403);
      res.send({ error: 1 }).end();
    }
  }
}
