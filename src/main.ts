// src/main.ts
import 'dotenv/config';
import './bootstrap/otel';
import { NestFactory } from '@nestjs/core';
import { configureApp } from './bootstrap/configure-app';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function init() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(
    join(process.cwd(), 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  app.enableShutdownHooks();

  await configureApp(app);
  await app.listen(process.env.PORT ?? 3000);

  // Graceful shutdown — ECS sends SIGTERM before SIGKILL (default stopTimeout: 30s)
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

init().catch(err => {
  console.error('Fatal error during bootstrap', err);
  process.exit(1);
});

