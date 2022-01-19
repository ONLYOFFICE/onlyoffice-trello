import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OnlyofficeController } from '@controllers/onlyoffice.controller';
import { SecurityService } from '@services/security.service';
import { RegistryService } from '@services/registry.service';
import { OAuthUtil } from '@utils/oauth';
import { Constants } from '@utils/const';
import { FileUtils } from '@utils/file';
import { TokenEditorVerificationMiddleware, TokenSettingsVerificationMiddleware } from '@middlewares/token';
import { ConventionalHandlersModule } from '@controllers/handlers/conventional.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheService } from '@services/cache.service';
import { ValidatorUtils } from '@utils/validation';
import { PrometheusService } from '@services/prometheus.service';
import { PrometheusController } from '@controllers/prometheus.controller';
import { SettingsController } from '@controllers/settings.controller';
import { EventService } from '@services/event.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConventionalHandlersModule,
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 200,
    }),
    CacheModule.register({
      ttl: 10,
      max: 200,
      isGlobal: true,
    }),
  ],
  controllers: [
    OnlyofficeController,
    SettingsController,
    PrometheusController,
  ],
  providers: [
    SecurityService,
    RegistryService,
    CacheService,
    PrometheusService,
    EventService,
    OAuthUtil,
    Constants,
    FileUtils,
    ValidatorUtils,
  ],
  exports: [
    RegistryService,
    OAuthUtil,
    CacheService,
    EventService,
    Constants,
    CacheModule,
    FileUtils,
  ],
})
export class ServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenEditorVerificationMiddleware)
      .forRoutes(
        `${OnlyofficeController.baseRoute}/editor`,
      )
      .apply(TokenSettingsVerificationMiddleware)
      .forRoutes(
        `${SettingsController.baseRoute}`,
      );
  }
}
