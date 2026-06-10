import { ApplicationException } from '../application.exception';

export class InsufficientScopeException extends ApplicationException {
  constructor() {
    super('INSUFFICIENT_SCOPE');
  }
}
