import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PolicyDecisionPort, PolicyInput, PolicyDecision } from '@application/ports/policy-decision.port';
import { PolicyDecisionUnavailableException } from '@application/exceptions/security/policy-decision-unavailable.exception';
import { ForbiddenByPolicyException } from '@application/exceptions/security/forbidden-by-policy.exception';

/**
 * Calls OPA's REST API to evaluate a policy decision.
 *
 * Expected OPA endpoint:  POST /v1/data/{package}
 * OPA response shape:
 *   { "result": true }                     → allow
 *   { "result": { "allow": false, "reason": "..." } }   → deny with reason
 *
 * Fail-closed by default: any network error or unexpected response denies access.
 * Set OPA_FAIL_OPEN=true in development to allow access when OPA is unreachable.
 */
@Injectable()
export class OpaHttpPolicyAdapter implements PolicyDecisionPort {
  private readonly opaUrl: string;
  private readonly policyPackage: string;
  private readonly timeoutMs: number;
  private readonly failOpen: boolean;
  private readonly isDev: boolean;

  constructor(
    @Inject(HttpService)
    private readonly http: HttpService
  ) {
    this.opaUrl = process.env.OPA_URL ?? 'http://localhost:8181';
    this.policyPackage = process.env.OPA_POLICY_PACKAGE ?? 'samples/allow';
    this.timeoutMs = Number(process.env.OPA_DECISION_TIMEOUT_MS ?? 500);
    this.failOpen = process.env.OPA_FAIL_OPEN === 'true';
    this.isDev = process.env.NODE_ENV !== 'production';
  }

  async decide(input: PolicyInput): Promise<PolicyDecision> {
    const url = `${this.opaUrl}/v1/data/${this.policyPackage}`;

    let rawResult: unknown;

    try {
      const response = await firstValueFrom(
        this.http.post<{ result: unknown }>(
          url,
          { input },
          { timeout: this.timeoutMs },
        ),
      );
      rawResult = response.data.result;
    } catch (err) {
      if (this.failOpen && this.isDev) {
        console.error('OPA ERROR (fail-open):', err);
        return { allow: true, reason: 'OPA unreachable — fail-open in dev' };
      }
      console.error('OPA ERROR:', err)
      throw new PolicyDecisionUnavailableException();
    }

    return this.parseResult(rawResult);
  }

  // ── Result parser ─────────────────────────────────────────────────────────

  private parseResult(result: unknown): PolicyDecision {
    if (typeof result === 'boolean') {
      if (!result) throw new ForbiddenByPolicyException();
      return { allow: true };
    }

    if (result && typeof result === 'object') {
      const obj = result as Record<string, unknown>;
      const allow = Boolean(obj.allow);
      const reason = typeof obj.reason === 'string' ? obj.reason : undefined;

      if (!allow) throw new ForbiddenByPolicyException();
      return { allow, reason };
    }

    // Unexpected shape — fail closed
    throw new PolicyDecisionUnavailableException();
  }
}
