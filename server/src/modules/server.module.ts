import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { OnlyofficeController } from '@controllers/onlyoffice.controller';
import { FileService } from '@services/file.service';
import { SecurityService } from '@services/security.service';
import { RegistryService } from '@services/registry.service';
import { OAuthUtil } from '@utils/oauth';
import { Constants } from '@utils/const';
import { FileUtils } from '@utils/file';
import { EditorVerificationMiddleware } from '@middlewares/editor';
import { TokenVerificationMiddleware } from '@middlewares/token';
import { ConventionalHandlersModule } from '@controllers/handlers/conventional.module';
import { TestController } from '@controllers/test.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisCacheService } from '@services/redis.service';
import { ValidatorUtils } from '@utils/validation';
import { PrometheusService } from '@services/prometheus.service';
import { PrometheusController } from '@controllers/prometheus.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConventionalHandlersModule,
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 10000,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('CACHE_URL'),
        port: configService.get('CACHE_PORT'),
        ttl: 0,
        max: 100000,
      }),
    }),
  ],
  controllers:
    process.env.IS_DEVELOPMENT === '1'
      ? [OnlyofficeController, TestController, PrometheusController]
      : [OnlyofficeController, PrometheusController],
  providers: [
    FileService,
    SecurityService,
    RegistryService,
    RedisCacheService,
    PrometheusService,
    OAuthUtil,
    Constants,
    FileUtils,
    ValidatorUtils,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [
    RegistryService,
    FileService,
    OAuthUtil,
    RedisCacheService,
    Constants,
  ],
})
export class ServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenVerificationMiddleware)
      .forRoutes(
        `${OnlyofficeController.baseRoute}/editor`,
        `${OnlyofficeController.baseRoute}/callback`,
      )
      .apply(EditorVerificationMiddleware)
      .forRoutes(`${OnlyofficeController.baseRoute}/editor`);
  }
}
