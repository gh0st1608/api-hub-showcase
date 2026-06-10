export interface PolicyInput {
  user: Record<string, unknown>;
  action: string;
  resource: string;
  attributes?: Record<string, unknown>;
}

export interface PolicyDecision {
  allow: boolean;
  reason?: string;
}

export interface PolicyDecisionPort {
  decide(input: PolicyInput): Promise<PolicyDecision>;
}

export const PolicyDecisionPortSymbol = Symbol('PolicyDecisionPort');
