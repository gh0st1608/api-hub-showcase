import { ApplicationException } from '../application.exception';

export class InvalidTokenException extends ApplicationException {
  constructor() {
    super('INVALID_TOKEN');
  }
}
