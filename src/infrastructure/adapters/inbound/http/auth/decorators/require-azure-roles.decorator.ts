import { SetMetadata } from '@nestjs/common';
import { REQUIRED_AZURE_ROLES_KEY } from '../metadata-keys';

/**
 * Requires at least one Azure/Entra role from raw `roles` claim.
 * Evaluated by `JwtAuthGuard` without provider-specific fallbacks.
 *
 * @example
 *   @RequireAzureRoles('Viewer', 'Admin')
 */
export const RequireAzureRoles = (...roles: string[]) =>
  SetMetadata(REQUIRED_AZURE_ROLES_KEY, roles);
