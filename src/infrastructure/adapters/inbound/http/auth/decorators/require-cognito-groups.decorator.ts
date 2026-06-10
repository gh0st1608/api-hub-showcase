import { SetMetadata } from '@nestjs/common';
import { REQUIRED_COGNITO_GROUPS_KEY } from '../metadata-keys';

/**
 * Requires at least one of the listed Cognito groups from `cognito:groups`.
 * Evaluated by `JwtAuthGuard` using the raw token claim (no roles fallback).
 *
 * @example
 *   @RequireCognitoGroups('admin', 'viewer')
 */
export const RequireCognitoGroups = (...groups: string[]) =>
  SetMetadata(REQUIRED_COGNITO_GROUPS_KEY, groups);
