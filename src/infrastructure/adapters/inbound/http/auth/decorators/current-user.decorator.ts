import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '@domain/entities/authenticated-user.entity';

/**
 * Parameter decorator that injects the authenticated user populated by
 * `JwtAuthGuard` into a controller method parameter.
 *
 * @example
 *   async getById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
