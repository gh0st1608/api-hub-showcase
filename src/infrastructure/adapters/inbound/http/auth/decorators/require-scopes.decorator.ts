import { SetMetadata } from '@nestjs/common';
import { REQUIRED_SCOPES_KEY } from '../metadata-keys';

/**
 * Requires all listed OAuth 2.0 scopes to be present in the token.
 * Evaluated by `JwtAuthGuard` after the token is validated.
 *
 * @example
 *   @RequireScopes('samples:read', 'samples:write')
 */
export const RequireScopes = (...scopes: string[]) => SetMetadata(REQUIRED_SCOPES_KEY, scopes);
