import { ApplicationException } from '../application.exception';

export class InsufficientRoleException extends ApplicationException {
  constructor() {
    super('INSUFFICIENT_ROLE');
  }
}
