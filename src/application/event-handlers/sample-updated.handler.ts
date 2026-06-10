import { Injectable, Inject } from '@nestjs/common';
import { EventHandlerPort, EventEnvelope } from '@application/ports/event-handler.port';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { MetricsPort, MetricsPortSymbol } from '@application/ports/metrics.port';
import { SampleUpdatedPayload } from '@domain/events/sample-updated.event';

/**
 * Handles the `sample.updated` domain event.
 *
 * Example use cases for this handler:
 *   - Refresh a search index entry
 *   - Invalidate a cache key
 *   - Notify downstream services of the change
 */
@Injectable()
export class SampleUpdatedHandler implements EventHandlerPort<SampleUpdatedPayload> {
  readonly eventType = 'sample.updated';

  constructor(
    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,

    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,
  ) {}

  async handle(event: EventEnvelope<SampleUpdatedPayload>): Promise<void> {
    this.logger.info('SAMPLE_UPDATED_HANDLED', {
      eventId: event.eventId,
      sampleId: event.payload.id,
      sampleName: event.payload.name,
    });

    // Log visual para pruebas locales
    console.log('[DAPR EVENT] sample.updated recibido:', JSON.stringify(event, null, 2));

    this.metrics.increment('sample.updated.handled');
    // TODO: add real side-effects here (cache invalidation, search index, etc.)
  }
}
