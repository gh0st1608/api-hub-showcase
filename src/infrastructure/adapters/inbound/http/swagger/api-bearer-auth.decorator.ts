import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiAppError } from './api-error.decorator';

/**
 * Convenience decorator for protected endpoints. Combines:
 *   - `@ApiBearerAuth('bearer')` — tells Swagger UI to send the Authorization header
 *   - `@ApiAppError(...)` — documents all auth/authz error responses from ErrorRegistry
 *
 * @example
 *   @ApiBearer()
 *   @Get(':id')
 *   async getById(@Param('id') id: string) { ... }
 */
export const ApiBearer = () =>
  applyDecorators(
    ApiBearerAuth('bearer'),
    ApiAppError(
      'UNAUTHENTICATED',
      'INVALID_TOKEN',
      'TOKEN_EXPIRED',
      'INSUFFICIENT_SCOPE',
      'INSUFFICIENT_ROLE',
      'FORBIDDEN_BY_POLICY',
    ),
  );
