import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { context, trace } from '@opentelemetry/api';

export interface RequestContext {
  correlationId: string;
  traceId?: string;
  spanId?: string;
  userAgent?: string;
  ip?: string;
}

type ObservabilityRequest = Request & {
  context: RequestContext;
};

function getHeader(
  headers: Request['headers'],
  key: string,
): string | undefined {
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
}

export function observabilityMiddleware(
  req: ObservabilityRequest,
  res: Response,
  next: NextFunction,
) {
  // Skip health/readiness probes — avoid noise in traces and logs
  if (req.url === '/health' || req.url === '/ready') {
    return next();
  }

  const incomingCorrelationId =
    getHeader(req.headers, 'x-correlation-id') ||
    getHeader(req.headers, 'traceparent');

  const correlationId = incomingCorrelationId || randomUUID();

  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  const span = trace.getSpan(context.active());

  let traceId: string | undefined;
  let spanId: string | undefined;

  if (span) {
    const spanContext = span.spanContext();
    traceId = spanContext.traceId;
    spanId = spanContext.spanId;
  }

  // Request context enriquecido
  req.context = {
    correlationId,
    traceId,
    spanId,
    userAgent: getHeader(req.headers, 'user-agent'),
    ip: req.ip,
  };

  // Headers de respuesta (debug)
  if (traceId) {
    res.setHeader('x-trace-id', traceId);
  }

  next();
}