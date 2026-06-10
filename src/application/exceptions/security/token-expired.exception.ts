import { ApplicationException } from '../application.exception';

export class TokenExpiredException extends ApplicationException {
  constructor() {
    super('TOKEN_EXPIRED');
  }
}
