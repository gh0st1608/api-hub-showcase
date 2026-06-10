import { SetMetadata } from '@nestjs/common';
import { AUTHORIZE_KEY } from '../metadata-keys';

export interface OpaRule {
  /** Logical action name passed to OPA (e.g. 'read', 'write', 'delete'). */
  action: string;
  /** Logical resource name passed to OPA (e.g. 'sample', 'report'). */
  resource: string;
}

/**
 * Triggers the `OpaAuthorizationGuard` for this endpoint.
 * Passes `action` and `resource` to the OPA policy as part of the input.
 *
 * @example
 *   @Authorize({ action: 'read', resource: 'sample' })
 */
export const Authorize = (rule: OpaRule) => SetMetadata(AUTHORIZE_KEY, rule);
