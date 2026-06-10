import { InfrastructureException } from "./infrastructure.exception";

export class QueryFailedException extends InfrastructureException {
  constructor() {
    super('QUERY_FAILED');
  }
}