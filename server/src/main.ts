import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { Request, Response } from 'express';
import { AggregatorRegistry } from 'prom-client';
import * as helmet from 'helmet';
import { join } from 'path';
import { cpus } from 'os';
const cluster = require('cluster');

import { ServerModule } from '@modules/server.module';
import { NotFoundExceptionFilter } from '@filters/notfound';

async function main() {
  process.env.UV_THREADPOOL_SIZE = cpus().length.toString();
  // const aggregatorRegistry = new AggregatorRegistry();

  if (cluster.isPrimary) {
    // const metricsServer = express();

    for (let cpu = 0; cpu < cpus().length; cpu++) {
      cluster.fork();
    }

    // metricsServer.get(
    //   '/metrics',
    //   async (_: Request, res: Response) => {
    //     const metrics = await aggregatorRegistry.clusterMetrics();
    //     res.set('Content-Type', aggregatorRegistry.contentType);
    //     res.send(metrics);
    //   },
    // );

    cluster.on('exit', () => {
      cluster.fork();
    });

    // metricsServer.listen(process.env.METRICS_SERVER_PORT || 3001);
  } else {
    const server = await NestFactory.create<NestExpressApplication>(
      ServerModule,
      {
        logger:
          process.env.IS_DEBUG === '1'
            ? ['error', 'warn', 'debug', 'log']
            : ['error', 'warn', 'log'],
      },
    );

    server.use(
      helmet({
        contentSecurityPolicy: false,
        frameguard: false,
      }),
    );
    server.enableCors({
      origin: ['https://trello.com', process.env.SERVER_HOST],
      credentials: true,
    });
    server.setViewEngine('hbs');
    server.setBaseViewsDir(join(__dirname, '..', 'views'));
    server.useGlobalFilters(new NotFoundExceptionFilter());

    await server.listen(process.env.SERVER_PORT!);
  }
}

main();
