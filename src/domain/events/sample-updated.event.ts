import { DomainEvent } from './domain-event';

export interface SampleUpdatedPayload {
  id: string;
  name: string;
  description?: string;
}

export class SampleUpdatedEvent extends DomainEvent<SampleUpdatedPayload> {
  readonly eventType = 'sample.updated';
}
