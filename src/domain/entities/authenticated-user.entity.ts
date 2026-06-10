/**
 * Normalized representation of an authenticated principal, extracted from a
 * validated OIDC JWT. All provider-specific claim shapes (Cognito, Keycloak,
 * Entra ID) are resolved into this common structure by the token validator
 * adapter — the rest of the application never deals with raw JWT claims.
 */
export class AuthenticatedUser {
  /** `sub` claim — unique identifier of the principal within the IdP. */
  readonly sub: string;

  /** `email` claim when present in the token. */
  readonly email?: string;

  /** Resolved roles from `roles`, `cognito:groups`, or `realm_access.roles`. */
  readonly roles: string[];

  /** Resolved scopes from `scope` or `scp`, split into individual strings. */
  readonly scopes: string[];

  /** Raw JWT payload — available for advanced cases; avoid coupling to it. */
  readonly claims: Record<string, unknown>;

  constructor(params: {
    sub: string;
    email?: string;
    roles: string[];
    scopes: string[];
    claims: Record<string, unknown>;
  }) {
    this.sub = params.sub;
    this.email = params.email;
    this.roles = params.roles;
    this.scopes = params.scopes;
    this.claims = params.claims;
  }
}
