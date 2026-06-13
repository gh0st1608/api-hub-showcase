import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { AuthModule } from '@app/auth.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { EventModule } from '@app/event.module';
import { ProjectModule } from '@app/project.module';
//import { SampleModule } from '@app/sample.module';
import { HealthModule } from '@infrastructure/adapters/inbound/http/health/health.module';
import { HttpExceptionFilter } from '@infrastructure/adapters/inbound/http/filters/http-error.filter';
import { appConfig } from '@app/bootstrap/config.schema';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
      validate: appConfig,
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss',
                  ignore: 'pid,hostname',
                  messageFormat: '{msg} {req.method} {req.url}',
                },
              }
            : undefined,

        customProps: (req: any) => ({
          correlationId: req.headers['x-correlation-id'],
          userAgent: req.headers['user-agent'],
        }),

        autoLogging: {
          ignore: (req: any) => ['/health', '/ready'].includes(req.url),
        },
      },
    }),

    ObservabilityModule,
    AuthModule,
    EventModule,
    ProjectModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
