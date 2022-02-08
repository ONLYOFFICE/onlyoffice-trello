/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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
      this.logger.debug("trying to verify a trello client's token (editor)");
      this.logger.debug(req.headers);
      const signature = req.query.signature as string;
      this.logger.debug(`signature ${signature}`);
      try {
        const [sig] = await this.securityService.verifyTrello(signature);
        if (!sig.due || sig.due <= Number(new Date())) {
          throw new Error(`token has expired or has no expiration stamp [exp: ${sig.due}]`);
        }
        res.set(this.constants.HEADER_ONLYOFFICE_DOC_KEY, sig.docKey);
        this.logger.debug("client's token is valid");
        next();
      } catch (err) {
        this.logger.error(err);
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
        private readonly constants: Constants,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
      this.logger.debug("trying to verify a trello client's token (settings)");
      this.logger.debug(req.headers);
      const signature = req.query.signature as string;
      this.logger.debug(`signature: ${signature}`);
      try {
        const [sig, role, orgID] = await this.securityService.verifyTrello(signature);
        if (!sig.due || sig.due <= Number(new Date()) || !orgID) {
          throw new Error(`token is invalid or malformed [To: ${sig.due}, Org: ${orgID}]`);
        }
        if (role !== 'admin') throw new Error('invalid role to mutate settings');

        this.logger.debug("client's token is valid");
        res.set(this.constants.HEADER_ONLYOFFICE_ORG_ID, orgID);
        next();
      } catch (err) {
        this.logger.error(err);
        res.status(403);
        res.send({ error: 1 }).end();
      }
    }
}
