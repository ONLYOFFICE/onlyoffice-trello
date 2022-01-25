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
    .validate(process.env);

  if (error && error.message.indexOf('NVM_INC') === -1
      && error.message.indexOf('TERM_PROGRAM') === -1
      && error.message.indexOf('APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL') === -1) throw new Error(error.message);

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
    server.setBaseViewsDir(join(__dirname, '..', 'views'));
    server.useGlobalFilters(new NotFoundExceptionFilter());

    await server.listen(process.env.SERVER_PORT!);
  }
}

main();
