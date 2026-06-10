import { Injectable } from '@nestjs/common';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { TracingPort } from '@application/ports/tracing.port';

@Injectable()
export class OtelTracingService implements TracingPort {
  private tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME || 'user-service');

  async startSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return this.tracer.startActiveSpan(name, async (span) => {
      try {
        return await fn();
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  addEvent(name: string, attributes?: Record<string, any>): void {
    const span = trace.getSpan(context.active());
    span?.addEvent(name, attributes);
  }
}