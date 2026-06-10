import { DomainEvent } from './domain-event';

export interface SampleCreatedPayload {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export class SampleCreatedEvent extends DomainEvent<SampleCreatedPayload> {
  readonly eventType = 'sample.created';
}
