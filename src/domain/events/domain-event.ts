import { randomUUID } from 'crypto';

/**
 * Base class for all domain events.
 *
 * Every event that crosses a service boundary (published to SNS/SQS)
 * carries a standard envelope so consumers can route and process it
 * without parsing the payload.
 *
 * Naming convention: `<aggregate>.<past-tense-verb>`
 *   e.g. `sample.created`, `order.placed`, `payment.failed`
 */
export abstract class DomainEvent<TPayload = unknown> {
  /** Globally unique event identifier (UUID v4). */
  public readonly eventId: string;

  /** Fully qualified event type — used for routing. */
  public abstract readonly eventType: string;

  /** Logical source service (set from OTEL_SERVICE_NAME). */
  public readonly source: string;

  /** Schema version — increment when payload shape changes. */
  public readonly version: string;

  /** ISO 8601 UTC timestamp of when the event occurred. */
  public readonly timestamp: string;

  /** Event-specific data. */
  public readonly payload: TPayload;

  constructor(payload: TPayload, version = '1') {
    this.eventId = randomUUID();
    this.source = process.env.OTEL_SERVICE_NAME ?? 'unknown-service';
    this.version = version;
    this.timestamp = new Date().toISOString();
    this.payload = payload;
  }

  /** Serialize to the SNS Message envelope. */
  toEnvelope(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      source: this.source,
      version: this.version,
      timestamp: this.timestamp,
      payload: this.payload,
    };
  }
}
