import { ApplicationException } from '../application.exception';

export class ForbiddenByPolicyException extends ApplicationException {
  constructor() {
    super('FORBIDDEN_BY_POLICY');
  }
}
