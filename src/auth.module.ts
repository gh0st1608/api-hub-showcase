import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';

import { TokenValidatorPortSymbol } from '@application/ports/token-validator.port';
import { PolicyDecisionPortSymbol } from '@application/ports/policy-decision.port';

import { JoseJwksTokenValidator } from '@infrastructure/adapters/outbound/auth/jose-jwks.token-validator';
import { OpaHttpPolicyAdapter } from '@infrastructure/adapters/outbound/authorization/opa-http.policy.adapter';
import { JwtAuthGuard } from '@infrastructure/adapters/inbound/http/auth/jwt-auth.guard';
import { OpaAuthorizationGuard } from '@infrastructure/adapters/inbound/http/auth/opa-authorization.guard';

/**
 * Global security module.
 *
 * Registers both guards as global APP_GUARDs — Nest evaluates them in
 * registration order, so authentication (JWT) always runs before
 * authorization (OPA).
 *
 * Bypass routes with @Public() decorator.
 * Disable entirely in development with AUTH_ENABLED=false.
 */
@Global()
@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 0 }),
  ],
  providers: [
    {
      provide: TokenValidatorPortSymbol,
      useClass: JoseJwksTokenValidator,
    },
    {
      provide: PolicyDecisionPortSymbol,
      useClass: OpaHttpPolicyAdapter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OpaAuthorizationGuard,
    },
  ],
  exports: [
    TokenValidatorPortSymbol,
    PolicyDecisionPortSymbol,
  ],
})
export class AuthModule {}
