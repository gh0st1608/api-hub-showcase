import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { tap, catchError, throwError } from 'rxjs';
import {
  MetricsPort,
  MetricsPortSymbol,
} from '@application/ports/metrics.port';

@Injectable()
export class RequestMetricsInterceptorImpl implements NestInterceptor {
  constructor(
    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const start = Date.now();

    const route = req.route?.path || req.url;
    const method = req.method;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        // 🔥 total requests
        this.metrics.increment('http_request_total', {
          route,
          method,
          status: res.statusCode,
        });

        // 🔥 duration
        this.metrics.timing('http_request_duration', duration, {
          route,
          method,
          status: res.statusCode,
        });
      }),

      catchError((error) => {
        const duration = Date.now() - start;

        this.metrics.increment('http_request_total', {
          route,
          method,
          status: res.statusCode || 500,
          error: true,
        });

        this.metrics.timing('http_request_duration', duration, {
          route,
          method,
          status: res.statusCode || 500,
          error: true,
        });

        return throwError(() => error);
      }),
    );
  }
}