import { NextFunction, Request, Response } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { EditorPayload } from '@models/payloads';
import { SecurityService } from '@services/security.service';
import { Constants } from '@utils/const';

/**
 * A Middleware to verify document server's url and its sercet (Trello users)
 */
@Injectable()
export class EditorVerificationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(EditorVerificationMiddleware.name);

  constructor(
    private readonly constants: Constants,
    private readonly securityService: SecurityService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Trying to verify an editor token');
    const editorPayload = req.query.epayload as string;
    try {
      const ep = await this.securityService.verifyTrello(editorPayload);

      this.logger.debug(ep.ds);

      const epayload = new EditorPayload(ep.secret, ep.ds, ep.header);

      req.headers[this.constants.HEADER_DOCSERVER_URL] = epayload.ds;
      req.headers[this.constants.HEADER_DOCSERVER_SECRET] = epayload.secret;
      req.headers[this.constants.HEADER_DOCSERVER_HEADERNAME] = epayload.header;

      next();
    } catch (err) {
      this.logger.error(err);
      res.status(403).end();
    }
  }
}
