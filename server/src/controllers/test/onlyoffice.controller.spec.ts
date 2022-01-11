import { OnlyofficeController } from "../onlyoffice.controller";
import { Test } from "@nestjs/testing";
import * as request from 'supertest';
import { RedisCacheService } from "@services/redis.service";
import { CACHE_MANAGER } from "@nestjs/common";
import { SecurityService } from "@services/security.service";
import { RegistryService } from "@services/registry.service";
import { Constants } from "@utils/const";
import { OAuthUtil } from "@utils/oauth";
import { ValidatorUtils } from "@utils/validation";
import { FileUtils } from "@utils/file";
import { EditorPayloadForm } from "@models/payload";
import { NestExpressApplication } from "@nestjs/platform-express";

const mockRedisSet = (key: string, value: string, ttl?: number) => {

};

const mockRedisDel = (key: string) => {

};

describe('Onlyoffice Controller', () => {
    let app: NestExpressApplication;
    let secService: SecurityService;
    beforeEach(async () => {
        const mockRedisService = {
            get: jest.fn().mockReturnValue(Promise.resolve(JSON.stringify({
                proxyResource: "aaa".repeat(100),
                proxySecret: "acsascscscscas",
                token: "1".repeat(32),
                card: "1".repeat(11),
                attachment: "1".repeat(11),
                filename: "test.docx",
                ds: "asdsad",
                dsheader: "Auth",
                dsjwt: "secret",
            }))),
            set: mockRedisSet,
            del: mockRedisDel,
        };
        const moduleRef = await Test.createTestingModule({
            controllers: [OnlyofficeController],
            providers: [
                { provide: CACHE_MANAGER, useValue: mockRedisService },
                RedisCacheService,
                RegistryService,
                SecurityService,
                Constants,
                OAuthUtil,
                ValidatorUtils,
                FileUtils,
            ],
        }).compile();

        secService = moduleRef.get(SecurityService);
        app = moduleRef.createNestApplication<NestExpressApplication>();
        app.setViewEngine('hbs');
        await app.init();
    });

    it('Get invalid path', async () => {
        const res = await request(app.getHttpServer())
        .get('/')
        expect(res.statusCode).toBe(404);
    });

    describe('Editor endpoint', () => {
        it('Invalid body', async () => {
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            expect(res.statusCode).toBe(400);
        });

        it('Invalid resource length', async () => {
            const body: EditorPayloadForm = {
                payload: JSON.stringify({
                    proxyResource: "",
                    proxySecret: "",
                    token: "1".repeat(32),
                    card: "1".repeat(11),
                    attachment: "1".repeat(11),
                    filename: "test.docx",
                    ds: "asdsad",
                    dsheader: "header",
                    dsjwt: secService.encrypt("secret", process.env.POWERUP_APP_ENCRYPTION_KEY),
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.get('X-ONLYOFFICE-REASON')).toBe('Error: Invalid form payload');
        });

        it('Invalid ds url', async () => {
            const body: EditorPayloadForm = {
                payload: JSON.stringify({
                    proxyResource: "a".repeat(100),
                    proxySecret: "",
                    token: "1".repeat(32),
                    card: "1".repeat(11),
                    attachment: "1".repeat(11),
                    filename: "test.docx",
                    ds: "asdsad",
                    dsheader: "header",
                    dsjwt: secService.encrypt("secret", process.env.POWERUP_APP_ENCRYPTION_KEY),
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.get('X-ONLYOFFICE-REASON')).toBe('Error: Invalid document server url');
        });

        it('Unsupported doc type', async () => {
            const body: EditorPayloadForm = {
                payload: JSON.stringify({
                    proxyResource: "a".repeat(100),
                    proxySecret: "",
                    token: "1".repeat(32),
                    card: "1".repeat(11),
                    attachment: "1".repeat(11),
                    filename: "test.unknown",
                    ds: "https://httpbin.com/",
                    dsheader: "header",
                    dsjwt: secService.encrypt("secret", process.env.POWERUP_APP_ENCRYPTION_KEY),
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.get('X-ONLYOFFICE-REASON')).toBe('Error: File type is not supported');
        });

        it('Invalid DS Command call', async () => {
            const body: EditorPayloadForm = {
                payload: JSON.stringify({
                    proxyResource: "a".repeat(100),
                    proxySecret: "",
                    token: "1".repeat(32),
                    card: "1".repeat(11),
                    attachment: "1".repeat(11),
                    filename: "test.docx",
                    ds: "https://httpbin.com/",
                    dsheader: "header",
                    dsjwt: secService.encrypt("secret", process.env.POWERUP_APP_ENCRYPTION_KEY),
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.get('X-ONLYOFFICE-REASON')).toContain('Error: Request failed with status code 401');
        });
    });

    describe('Callback endpoint', () => {
        it('Invalid jwt', async () => {
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/callback')
            .set('Auth', 'Bearer mocktoken')
            .send({});
            expect(res.statusCode).toBe(403);
        });

        it('Valid callback endpoint call', async () => {
            const jwt = secService.sign('mocktoken', 'secret');
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/callback')
            .set('Auth', `Bearer ${jwt}`)
            .send({});
            expect(res.statusCode).toBe(200);
        });
    });
});
