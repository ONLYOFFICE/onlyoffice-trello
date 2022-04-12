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

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { join } from 'path';
import { cpus } from 'os';

import { ServerModule } from '@modules/server.module';
import { NotFoundExceptionFilter } from '@filters/notfound';

import validationSchema from './validation';
import WinstonLogger from './logger';

const cluster = require('cluster');

async function main() {
  const { error } = validationSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env, {
      allowUnknown: true,
    });

  if (error) throw new Error(error.message);

  process.env.UV_THREADPOOL_SIZE = cpus().length.toString();

  if (cluster.isPrimary) {
    for (let cpu = 0; cpu < cpus().length; cpu += 1) {
      cluster.fork();
    }

    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    const server = await NestFactory.create<NestExpressApplication>(ServerModule, {
      logger: WinstonLogger,
    });

    server.use(
      helmet({
        contentSecurityPolicy: false,
        frameguard: false,
      }),
    );
    server.enableCors({
      origin: ['https://trello.com', process.env.SERVER_HOST, process.env.CLIENT_HOST],
      credentials: true,
    });
    server.set('trust proxy', 'loopback');
    server.setViewEngine('hbs');
    server.setBaseViewsDir(join(__dirname, 'views'));
    server.useGlobalFilters(new NotFoundExceptionFilter());

    await server.listen(process.env.SERVER_PORT!);
  }
}

main();
