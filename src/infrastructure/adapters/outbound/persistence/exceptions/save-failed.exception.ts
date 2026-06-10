import { InfrastructureException } from '@infrastructure/adapters/outbound/persistence/exceptions/infrastructure.exception';

export class SaveFailedException extends InfrastructureException {
  constructor() {
    super('SAVE_FAILED');
  }
}