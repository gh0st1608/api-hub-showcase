// src/bootstrap/configure-app.ts
import 'reflect-metadata';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { observabilityMiddleware } from '@infrastructure/middlewares/correlation.middleware';

export async function configureApp(app: INestApplication): Promise<void> {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.use(observabilityMiddleware);

  

  app.enableCors({
    origin: '*',
  });
}