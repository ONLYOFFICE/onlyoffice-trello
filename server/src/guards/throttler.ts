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
