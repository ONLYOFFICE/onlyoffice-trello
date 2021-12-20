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
    const errpage = '<!DOCTYPE html>\n' +
    '<html>\n' +
    '\n' +
    '<head runat="server">\n' +
    '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
    '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
    '    <meta name="viewport"\n' +
    '        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />\n' +
    '    <meta name="apple-mobile-web-app-capable" content="yes" />\n' +
    '    <meta name="mobile-web-app-capable" content="yes" />\n' +
    '    <!--\n' +
    '    *\n' +
    '    * (c) Copyright Ascensio System SIA 2021\n' +
    '    *\n' +
    '    * Licensed under the Apache License, Version 2.0 (the "License");\n' +
    '    * you may not use this file except in compliance with the License.\n' +
    '    * You may obtain a copy of the License at\n' +
    '    *\n' +
    '    *     http://www.apache.org/licenses/LICENSE-2.0\n' +
    '    *\n' +
    '    * Unless required by applicable law or agreed to in writing, software\n' +
    '    * distributed under the License is distributed on an "AS IS" BASIS,\n' +
    '    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
    '    * See the License for the specific language governing permissions and\n' +
    '    * limitations under the License.\n' +
    '    *\n' +
    '    -->\n' +
    '    <title>ONLYOFFICE</title>\n' +
    '    <style>\n' +
    '        body {\n' +
    '            background: #fff;\n' +
    '            color: #333;\n' +
    '            font-family: Arial, Tahoma, sans-serif;\n' +
    '            font-size: 12px;\n' +
    '            font-weight: normal;\n' +
    '            height: 100%;\n' +
    '            margin: 0;\n' +
    '            overflow-y: hidden;\n' +
    '            padding: 0;\n' +
    '            text-decoration: none;\n' +
    '        }\n' +
    '\n' +
    '        div {\n' +
    '            margin: 0;\n' +
    '            padding: 0;\n' +
    '        }\n' +
    '    </style>\n' +
    '</head>\n' +
    '\n' +
    '<body>\n' +
    '    <h1>Error</h1>\n' +
    '</body>\n' +
    '\n' +
    '</html>\n';
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

    it('Get ping', async () => {
        const res = await request(app.getHttpServer())
        .get('/onlyoffice/ping');
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
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
                    dsjwt: "secret",
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.text).toBe(errpage);
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
                    dsjwt: "secret",
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.text).toBe(errpage);
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
                    dsjwt: "secret",
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.text).toBe(errpage);
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
                    dsjwt: "secret",
                }),
            };
            const res = await request(app.getHttpServer())
            .post('/onlyoffice/editor')
            .send(body);
            expect(res.text).toBe(errpage);
            expect(res.get('X-ONLYOFFICE-REASON')).toContain('Error: getaddrinfo ENOTFOUND');
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
