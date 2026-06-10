import { ApplicationException } from '../application.exception';

export class PolicyDecisionUnavailableException extends ApplicationException {
  constructor() {
    super('POLICY_DECISION_UNAVAILABLE');
  }
}
