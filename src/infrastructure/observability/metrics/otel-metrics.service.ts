import { Injectable } from '@nestjs/common';
import { metrics, Counter, Histogram } from '@opentelemetry/api';
import { MetricsPort } from '@application/ports/metrics.port';

type Attributes = Record<string, string | number | boolean>;

@Injectable()
export class OtelMetricsService implements MetricsPort {
  private meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME || 'user-service');

  private counters = new Map<string, Counter>();
  private histograms = new Map<string, Histogram>();

  increment(name: string, attributes?: Attributes): void {
    if (!this.counters.has(name)) {
      this.counters.set(
        name,
        this.meter.createCounter(name, {
          description: `Counter for ${name}`,
        }),
      );
    }

    this.counters.get(name)!.add(1, attributes);
  }

  record(name: string, value: number, attributes?: Attributes): void {
    if (!this.histograms.has(name)) {
      this.histograms.set(
        name,
        this.meter.createHistogram(name, {
          description: `Histogram for ${name}`,
        }),
      );
    }

    this.histograms.get(name)!.record(value, attributes);
  }

  timing(name: string, duration: number, attributes?: Attributes): void {
    this.record(name, duration, attributes);
  }
}