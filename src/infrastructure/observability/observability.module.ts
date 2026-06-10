import { Global, Module } from '@nestjs/common';

import { MetricsPortSymbol } from '@application/ports/metrics.port';
import { LoggingPortSymbol } from '@application/ports/logging.port';
import { TracingPortSymbol } from '@application/ports/tracing.port';
import { ErrorPortSymbol } from '@application/ports/error.port';

import { OtelMetricsService } from '@infrastructure/observability/metrics/otel-metrics.service';
import { OtelLoggingService } from '@infrastructure/observability/logging/otel-logging.service';
import { OtelTracingService } from '@infrastructure/observability/tracing/otel-tracing.sevice';
import { OTelErrorService } from '@infrastructure/observability/errors/otel-errors.service';


@Global()
@Module({
  providers: [
    {
      provide: MetricsPortSymbol,
      useClass: OtelMetricsService,
    },
    {
      provide: LoggingPortSymbol,
      useClass: OtelLoggingService,
    },
    {
      provide: TracingPortSymbol,
      useClass: OtelTracingService,
    },
    {
      provide: ErrorPortSymbol,
      useClass: OTelErrorService,
    }
  ],
  exports: [
    MetricsPortSymbol,
    LoggingPortSymbol,
    TracingPortSymbol,
    ErrorPortSymbol,
  ],
})
export class ObservabilityModule {}