import { ApplicationException } from '../application.exception';

export class UnauthenticatedException extends ApplicationException {
  constructor() {
    super('UNAUTHENTICATED');
  }
}
