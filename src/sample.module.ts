import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SampleModel } from '@infrastructure/adapters/outbound/persistence/models/sample.model';
import { TypeOrmSampleRepositoryImpl } from '@infrastructure/adapters/outbound/persistence/typeorm-sample.repository';
import { SampleController } from '@infrastructure/adapters/inbound/http/controllers/sample.controller';
import { SampleRepositoryPortSymbol } from '@domain/ports/sample.port';

import { ListSamplesUseCase } from '@application/usecase/list-samples.usecase';
import { GetSampleByIdUseCase } from '@application/usecase/get-sample-by-id.usecase';
import { CreateSampleUseCase } from '@application/usecase/create-sample.usecase';
import { UpdateSampleUseCase } from '@application/usecase/update-sample.usecase';

import { RequestMetricsInterceptorImpl } from '@infrastructure/adapters/inbound/http/interceptors/metrics-request.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([SampleModel])],
  controllers: [SampleController],
  providers: [
    ListSamplesUseCase,
    GetSampleByIdUseCase,
    CreateSampleUseCase,
    UpdateSampleUseCase,
    {
      provide: SampleRepositoryPortSymbol,
      useClass: TypeOrmSampleRepositoryImpl,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestMetricsInterceptorImpl,
    },
  ],
})
export class SampleModule {}
