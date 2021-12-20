import {
    CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import {OnlyofficeController} from '@controllers/onlyoffice.controller';
import {SecurityService} from '@services/security.service';
import {RegistryService} from '@services/registry.service';
import {OAuthUtil} from '@utils/oauth';
import {Constants} from '@utils/const';
import {FileUtils} from '@utils/file';
import {TokenVerificationMiddleware} from '@middlewares/token';
import {ConventionalHandlersModule} from '@controllers/handlers/conventional.module';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import {RedisCacheService} from '@services/redis.service';
import {ValidatorUtils} from '@utils/validation';
import {PrometheusService} from '@services/prometheus.service';
import {PrometheusController} from '@controllers/prometheus.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ConventionalHandlersModule,
        ThrottlerModule.forRoot({
            ttl: 1,
            limit: 1000,
        }),
        CacheModule.registerAsync({
            isGlobal: true,
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
    controllers: [OnlyofficeController, PrometheusController],
    providers: [
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
        OAuthUtil,
        RedisCacheService,
        Constants,
        CacheModule,
    ],
})
export class ServerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.
            apply(TokenVerificationMiddleware).
            forRoutes(
                `${OnlyofficeController.baseRoute}/editor`,
            );
    }
}
