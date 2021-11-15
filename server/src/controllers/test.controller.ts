import { Controller, Get, Logger, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrometheusService } from '@services/prometheus.service';
import { RedisCacheService } from '@services/redis.service';
import { SecurityService } from '@services/security.service';
import { Response } from 'express';

@Controller({ path: TestController.baseRoute })
export class TestController {
  private readonly logger = new Logger(TestController.name);
  public static readonly baseRoute = '/api/v1/test';

  constructor(
    private readonly cacheManager: RedisCacheService,
    private readonly securityService: SecurityService,
    private readonly prometheusService: PrometheusService,
  ) {}

  @Get('ping')
  @SkipThrottle()
  async ping(@Res() res: Response) {
    res.status(200);
    res.send('pong');
  }

  @Get('crypto-cached')
  @SkipThrottle()
  async getCryptoCached(@Res() res: Response) {
    const cachedEnc = await this.cacheManager.get('cryptography');

    if (!cachedEnc) {
      const encrypted = this.securityService
        .encrypt(Buffer.from('cryptography'))
        .toString('base64');
      const decrypted = this.securityService.decrypt(
        Buffer.from(encrypted, 'base64'),
      );
      await this.cacheManager.set('cryptography', encrypted, 10);
      res.status(200);
      res.send({
        encrypted: encrypted,
        decrypted: decrypted,
      });
    } else {
      this.logger.debug('Returning from cache');
      res.status(200);
      res.send({
        encrypted: cachedEnc,
        decrypted: 'cryptography',
      });
    }
  }

  @Get('crypto')
  async getCrypto(@Res() res: Response) {
    const encrypted = this.securityService
      .encrypt(Buffer.from('cryptography'))
      .toString('base64');
    const decrypted = this.securityService.decrypt(
      Buffer.from(encrypted, 'base64'),
    );
    res.status(200);
    res.send({
      encrypted: encrypted,
      decrypted: decrypted,
    });
  }

  @Get('jwt')
  @SkipThrottle()
  async getJwt(@Res() res: Response) {
    const text = 'hello';
    let jwtEncoded = this.securityService.sign(Buffer.from(text), 'secret');
    jwtEncoded = this.securityService.sign(Buffer.from(text), 'anotherone');
    const jwtDecoded = await this.securityService.verify(
      jwtEncoded,
      'anotherone',
    );

    res.send({
      encoded: jwtEncoded,
      decoded: jwtDecoded,
    });
  }
}
