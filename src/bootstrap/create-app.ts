import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express, { Express } from 'express';
import { join } from 'path';
import { AppModule } from '@app/app.module';
import { configureApp } from './configure-app';

interface CreateAppOptions {
  expressInstance?: Express;
  serveLocalUploads?: boolean;
}

export async function createApp(
  options: CreateAppOptions = {},
): Promise<{
  app: NestExpressApplication;
  expressApp: Express;
}> {
  const expressApp = options.expressInstance ?? express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      bufferLogs: true,
    },
  );

  if (options.serveLocalUploads) {
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
  }

  await configureApp(app);
  await app.init();

  return {
    app,
    expressApp,
  };
}
