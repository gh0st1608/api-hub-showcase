import { Injectable } from '@nestjs/common';
import { trace, context } from '@opentelemetry/api';
import { ErrorPort } from '@application/ports/error.port';

@Injectable()
export class OTelErrorService implements ErrorPort {
  captureError(error: Error, meta?: Record<string, any>) {
    const span = trace.getSpan(context.active());

    if (!span) return;

    span.recordException(error);

    span.setAttributes({
      'error': true,
      'error.message': error.message,
      'error.name': error.name,
      'error.stack': error.stack,
      ...meta,
    });
  }
}