import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenValidatorPort, TokenValidatorPortSymbol } from '@application/ports/token-validator.port';
import { UnauthenticatedException } from '@application/exceptions/security/unauthenticated.exception';
import { InsufficientScopeException } from '@application/exceptions/security/insufficient-scope.exception';
import { InsufficientRoleException } from '@application/exceptions/security/insufficient-role.exception';
import {
  IS_PUBLIC_KEY,
  REQUIRED_SCOPES_KEY,
  REQUIRED_ROLES_KEY,
  REQUIRED_COGNITO_GROUPS_KEY,
  REQUIRED_AZURE_ROLES_KEY,
} from './metadata-keys';

// tsx (esbuild) does not emit design:paramtypes — Reflector must be injected
// explicitly so NestJS DI can resolve it without type metadata.
const ReflectorToken = Reflector;

/**
 * Global authentication guard. Validates the Bearer JWT on every request.
 *
 * Bypass conditions (checked in order):
 *   1. Route is decorated with `@Public()`
 *   2. `AUTH_ENABLED=false` environment variable (dev only)
 *
 * On success:
 *   - Attaches `AuthenticatedUser` to `request.user`
 *   - Enforces `@RequireScopes()`, `@RequireRoles()` and
 *     provider-specific decorators (`@RequireCognitoGroups()`,
 *     `@RequireAzureRoles()`) if present
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(ReflectorToken)
    private readonly reflector: Reflector,
    @Inject(TokenValidatorPortSymbol)
    private readonly tokenValidator: TokenValidatorPort,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // Bypass: public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    // Bypass: auth disabled (development only)
    if (process.env.AUTH_ENABLED === 'false') return true;

    const request = ctx.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    const user = await this.tokenValidator.validate(token);
    (request as any).user = user;

    // Scope check
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(REQUIRED_SCOPES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (requiredScopes?.length) {
      const hasAll = requiredScopes.every(s => user.scopes.includes(s));
      if (!hasAll) throw new InsufficientScopeException();
    }

    // Role check
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(REQUIRED_ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (requiredRoles?.length) {
      const hasOne = requiredRoles.some(r => user.roles.includes(r));
      if (!hasOne) throw new InsufficientRoleException();
    }

    // Explicit provider claim checks (raw claims only)
    const requiredCognitoGroups = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_COGNITO_GROUPS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    const requiredAzureRoles = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_AZURE_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    const providerChecks: boolean[] = [];

    if (requiredCognitoGroups?.length) {
      const cognitoGroups = toStringArray((user.claims as Record<string, unknown>)['cognito:groups']);
      providerChecks.push(hasAnyCaseInsensitive(cognitoGroups, requiredCognitoGroups));
    }

    if (requiredAzureRoles?.length) {
      const azureRoles = toStringArray((user.claims as Record<string, unknown>).roles);
      providerChecks.push(hasAnyCaseInsensitive(azureRoles, requiredAzureRoles));
    }

    // If provider-specific claim checks are configured, at least one must pass.
    if (providerChecks.length > 0 && !providerChecks.some(Boolean)) {
      throw new InsufficientRoleException();
    }

    return true;
  }

  private extractToken(request: Request): string {
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthenticatedException();
    const token = auth.slice(7).trim();
    if (!token) throw new UnauthenticatedException();
    return token;
  }
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string');
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

function hasAnyCaseInsensitive(values: string[], required: string[]): boolean {
  const normalized = new Set(values.map(v => v.toLowerCase()));
  return required.some(r => normalized.has(r.toLowerCase()));
}
