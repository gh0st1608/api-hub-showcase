/**
 * Shape of the deserialized event envelope received from SQS.
 * Matches the object returned by DomainEvent.toEnvelope().
 */
export interface EventEnvelope<TPayload = unknown> {
  eventId: string;
  eventType: string;
  source: string;
  version: string;
  timestamp: string;
  payload: TPayload;
}

/**
 * Inbound port — handles a domain event received from the event bus.
 *
 * Each concrete handler is registered in the `EventModule` and invoked
 * by `SqsEventConsumer` when a matching event arrives from the queue.
 *
 * TPayload is the shape of the event payload (e.g. SampleCreatedPayload).
 */
export interface EventHandlerPort<TPayload = unknown> {
  /** The eventType string this handler processes (e.g. `'sample.created'`). */
  readonly eventType: string;
  handle(event: EventEnvelope<TPayload>): Promise<void>;
}

export const EventHandlerPortSymbol = Symbol('EventHandlerPort');
