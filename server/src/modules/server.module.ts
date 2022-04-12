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

import {
  CacheModule,
  Logger,
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
      ttl: 40,
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
    Logger,
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
    SecurityService,
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
