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

import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * Callback specific rate limiter
 */
@Injectable()
export class DocumentServerThrottlerGuard extends ThrottlerGuard {
  /**
   *
   * @param context
   * @param limit
   * @param ttl
   * @returns
   */
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const key = this.generateKey(context, req.ips[0]);
    const ttls = await this.storageService.getRecord(key);

    if (ttls.length >= limit) {
      throw new ThrottlerException('rate limit exceeded');
    }

    await this.storageService.addRecord(key, ttl);
    return true;
  }
}
