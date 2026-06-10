import { DomainEvent } from '@domain/events/domain-event';

/**
 * Outbound port — publishes domain events to an event bus.
 *
 * In production this resolves to `SnsEventBusAdapter`.
 * In development/tests it resolves to `InMemoryEventBusAdapter`.
 *
 * The use case only knows about this interface — never about SNS/SQS.
 */
export interface EventBusPort {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}

export const EventBusPortSymbol = Symbol('EventBusPort');
