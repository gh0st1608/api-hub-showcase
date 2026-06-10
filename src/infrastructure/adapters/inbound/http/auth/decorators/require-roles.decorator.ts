import { SetMetadata } from '@nestjs/common';
import { REQUIRED_ROLES_KEY } from '../metadata-keys';

/**
 * Requires at least one of the listed roles to be present in the token.
 * Evaluated by `JwtAuthGuard` after the token is validated.
 *
 * @example
 *   @RequireRoles('admin', 'operator')
 */
export const RequireRoles = (...roles: string[]) => SetMetadata(REQUIRED_ROLES_KEY, roles);
