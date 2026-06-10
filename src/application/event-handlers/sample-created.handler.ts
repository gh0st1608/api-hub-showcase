import { Injectable, Inject } from '@nestjs/common';
import { EventHandlerPort, EventEnvelope } from '@application/ports/event-handler.port';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { SampleCreatedPayload } from '@domain/events/sample-created.event';

/**
 * Handles the `sample.created` domain event.
 *
 * Example use cases for this handler:
 *   - Send a welcome notification
 *   - Invalidate a cache entry
 *   - Trigger a downstream workflow
 *   - Write to a read-model (CQRS)
 */
@Injectable()
export class SampleCreatedHandler implements EventHandlerPort<SampleCreatedPayload> {
  readonly eventType = 'sample.created';

  constructor(
    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,
  ) {}

  async handle(event: any): Promise<void> {
    // Soporta CloudEvent, envelope o payload plano
    let payload: any;
    let eventId: string;

    if (event?.data && event?.specversion) {
      // CloudEvent
      payload = event.data;
      eventId = event.id || 'unknown';
    } else if (event?.payload) {
      // Envelope
      payload = event.payload;
      eventId = event.eventId || event.id || 'unknown';
    } else {
      // Payload plano
      payload = event;
      eventId = event.id || 'unknown';
    }

    this.logger.info('SAMPLE_CREATED_HANDLED', {
      eventId,
      sampleId: payload.id,
      sampleName: payload.name,
    });
    // TODO: add real side-effects here
  }
}
