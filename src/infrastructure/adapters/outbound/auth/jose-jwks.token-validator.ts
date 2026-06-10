import { Injectable } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, errors as joseErrors } from 'jose';
import { TokenValidatorPort } from '@application/ports/token-validator.port';
import { AuthenticatedUser } from '@domain/entities/authenticated-user.entity';
import { TokenExpiredException } from '@application/exceptions/security/token-expired.exception';
import { InvalidTokenException } from '@application/exceptions/security/invalid-token.exception';

/**
 * Provider-agnostic JWT validator using JWKS.
 *
 * Compatible out-of-the-box with:
 *   • AWS Cognito  — JWKS_URI: https://cognito-idp.<region>.amazonaws.com/<poolId>/.well-known/jwks.json
 *   • Keycloak     — JWKS_URI: https://<host>/realms/<realm>/protocol/openid-connect/certs
 *   • Entra ID     — JWKS_URI: https://login.microsoftonline.com/<tenant>/discovery/v2.0/keys
 *
 * Role / scope extraction uses a cascade of well-known claim names so the same
 * adapter works with all three providers without code changes.
 */
@Injectable()
export class JoseJwksTokenValidator implements TokenValidatorPort {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly algorithms: string[];
  private readonly rolesClaim: string | undefined;
  private readonly scopeClaim: string;

  constructor() {
    const authEnabled = process.env.AUTH_ENABLED !== 'false';
    const jwksUri = process.env.JWKS_URI;
    const issuer = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;

    this.algorithms = (process.env.JWT_ALGORITHMS ?? 'RS256').split(',').map(s => s.trim());
    this.rolesClaim = process.env.JWT_ROLES_CLAIM;
    this.scopeClaim = process.env.JWT_SCOPE_CLAIM ?? 'scope';

    if (!authEnabled) {
      // Auth is disabled — validate() will never be called (JwtAuthGuard bypasses it).
      // Set safe no-op defaults so the class can be instantiated without env vars.
      this.jwks = null as any;
      this.issuer = '';
      this.audience = '';
      return;
    }

    if (!jwksUri || !issuer || !audience) {
      throw new Error('JWKS_URI, JWT_ISSUER and JWT_AUDIENCE must be set when AUTH_ENABLED=true');
    }

    this.jwks = createRemoteJWKSet(new URL(jwksUri));
    this.issuer = issuer;
    this.audience = audience;
  }

  async validate(token: string): Promise<AuthenticatedUser> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: this.algorithms,
      });

      const claims = payload as Record<string, unknown>;

      return new AuthenticatedUser({
        sub: payload.sub ?? '',
        email: typeof claims.email === 'string' ? claims.email : undefined,
        roles: this.resolveRoles(claims),
        scopes: this.resolveScopes(claims),
        claims,
      });
    } catch (err) {
      if (err instanceof joseErrors.JWTExpired) throw new TokenExpiredException();
      if (err instanceof joseErrors.JWTClaimValidationFailed) throw new InvalidTokenException();
      if (err instanceof joseErrors.JWSSignatureVerificationFailed) throw new InvalidTokenException();
      // Any other jose error (malformed, unknown kid, etc.)
      throw new InvalidTokenException();
    }
  }

  // ── Claim resolvers ───────────────────────────────────────────────────────

  private resolveRoles(claims: Record<string, unknown>): string[] {
    // Explicit override via env
    if (this.rolesClaim) {
      return toStringArray(claims[this.rolesClaim]);
    }
    // Cascade: standard `roles` → Cognito `cognito:groups` → Keycloak `realm_access.roles`
    if (Array.isArray(claims.roles)) return toStringArray(claims.roles);
    if (Array.isArray(claims['cognito:groups'])) return toStringArray(claims['cognito:groups']);
    const realmAccess = claims['realm_access'];
    if (realmAccess && typeof realmAccess === 'object' && Array.isArray((realmAccess as any).roles)) {
      return toStringArray((realmAccess as any).roles);
    }
    return [];
  }

  private resolveScopes(claims: Record<string, unknown>): string[] {
    // Primary claim (default `scope`; override with JWT_SCOPE_CLAIM)
    const primary = claims[this.scopeClaim];
    if (primary) return toScopeArray(primary);
    // Entra ID / some providers use `scp` as array
    const scp = claims['scp'];
    if (scp) return toScopeArray(scp);
    return [];
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string');
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

function toScopeArray(value: unknown): string[] {
  if (typeof value === 'string') return value.split(' ').filter(Boolean);
  return toStringArray(value);
}
