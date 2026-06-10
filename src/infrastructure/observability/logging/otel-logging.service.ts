import { Injectable } from '@nestjs/common';
import pino from 'pino';

import { logs } from '@opentelemetry/api-logs';
import { trace, context as otelContext } from '@opentelemetry/api';

import { LoggingPort } from '@application/ports/logging.port';
import { StructuredLog, StructuredLogContext } from './structured-log.dto';

type Attributes = Record<string, string | number | boolean | undefined>;

@Injectable()
export class OtelLoggingService implements LoggingPort {
  private pino = pino({
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req: (req: any) => req && {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
      },
      res: (res: any) => res && {
        statusCode: res.statusCode,
        headers: res.getHeaders ? res.getHeaders() : res.headers,
        body: res.body,
      },
    },
  });

  private otelLogger = logs.getLogger('app');

  private buildStructuredLog(
    message: string,
    level: 'INFO' | 'WARN' | 'ERROR',
    meta?: Record<string, any>
  ): StructuredLog {
    const span = trace.getSpan(otelContext.active());
    const traceId = span?.spanContext().traceId;
    const spanId = span?.spanContext().spanId;

    const context: StructuredLogContext = {
      traceId,
      spanId,
      service: process.env.OTEL_SERVICE_NAME,
      environment: process.env.NODE_ENV,
      ...meta?.context,
    };

    return {
      message,
      level,
      context,
      request: meta?.req,
      response: meta?.res,
      ...meta,
    };
  }

  info(message: string, meta?: Record<string, any>): void {
    const log = this.buildStructuredLog(message, 'INFO', meta);
    this.pino.info(log);
    this.otelLogger.emit({
      severityText: 'INFO',
      body: message,
      attributes: log,
    });
  }

  warn(message: string, meta?: Record<string, any>): void {
    const log = this.buildStructuredLog(message, 'WARN', meta);
    this.pino.warn(log);
    this.otelLogger.emit({
      severityText: 'WARN',
      body: message,
      attributes: log,
    });
  }

  error(message: string, meta?: Record<string, any>): void {
    const log = this.buildStructuredLog(message, 'ERROR', meta);
    this.pino.error(log);
    this.otelLogger.emit({
      severityText: 'ERROR',
      body: message,
      attributes: log,
    });
  }
}