import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyDecisionPort, PolicyDecisionPortSymbol } from '@application/ports/policy-decision.port';
import { UnauthenticatedException } from '@application/exceptions/security/unauthenticated.exception';
import { IS_PUBLIC_KEY, AUTHORIZE_KEY } from './metadata-keys';
import { OpaRule } from './decorators/authorize.decorator';

// tsx (esbuild) does not emit design:paramtypes — explicit injection token required.
const ReflectorToken = Reflector;

/**
 * Global OPA authorization guard. Runs after `JwtAuthGuard`.
 *
 * Only activates when the handler or class has `@Authorize()` metadata.
 * Passes `{ user.claims, action, resource, attributes }` to OPA and
 * denies the request if `allow` is false.
 *
 * Uses the same `@Public()` bypass as the JWT guard.
 */
@Injectable()
export class OpaAuthorizationGuard implements CanActivate {
  constructor(
    @Inject(ReflectorToken)
    private readonly reflector: Reflector,
    @Inject(PolicyDecisionPortSymbol)
    private readonly policy: PolicyDecisionPort,
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // Bypass: public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    // Bypass: OPA disabled
    if (process.env.OPA_ENABLED !== 'true') return true;

    // Bypass: no @Authorize() metadata on this route
    const rule = this.reflector.getAllAndOverride<OpaRule | undefined>(AUTHORIZE_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!rule) return true;

    const request = ctx.switchToHttp().getRequest();
    if (!request.user) throw new UnauthenticatedException();
    const claims = request.user.claims;

    const scopes =
      typeof claims.scope === 'string'
        ? claims.scope.split(' ').filter(Boolean)
        : claims.scopes ?? [];

    const user = {
      sub: claims.sub,
      scopes,                // 👈 FIX CLAVE
      roles: claims.roles ?? [],
    };
    await this.policy.decide({
      user,
      action: rule.action,
      resource: rule.resource,
      attributes: {
        method: request.method,
        path: request.path,
        params: request.params,
        query: request.query,
      },
    });


    return true;
  }
}
