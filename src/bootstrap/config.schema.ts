import { z } from 'zod';

const schema = z.object({
  // ── Server ─────────────────────────────────────────────────────────────────
  PORT: z
    .string()
    .default('3000')
    .transform(Number)
    .refine(n => n > 0 && n < 65536, 'PORT must be a valid port number'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // ── OpenTelemetry ──────────────────────────────────────────────────────────
  OTEL_SERVICE_NAME: z.string().min(1, 'OTEL_SERVICE_NAME is required'),
  OTEL_SERVICE_NAMESPACE: z.string().default('backend'),
  OTEL_SERVICE_VERSION: z.string().default('0.0.0'),

  // Optional: when set, telemetry is sent to the collector; otherwise direct to New Relic
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_METRIC_EXPORT_INTERVAL: z
    .string()
    .default('10000')
    .transform(Number),

  // ── New Relic (required only when OTEL_EXPORTER_OTLP_ENDPOINT is absent) ──
  NEW_RELIC_LICENSE_KEY: z.string().optional(),
  NEW_RELIC_APP_NAME: z.string().optional(),

  // ── Database (Postgres / TypeORM) ─────────────────────────────────────────
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432').transform(Number),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  // ── Authentication (OIDC / JWT) ───────────────────────────────────────
  AUTH_ENABLED: z.string().default('true').transform(v => v === 'true'),
  JWT_ISSUER: z.string().url().optional(),
  JWT_AUDIENCE: z.string().optional(),
  JWKS_URI: z.string().url().optional(),
  JWT_ALGORITHMS: z
    .string()
    .default('RS256')
    .transform(s => s.split(',').map(x => x.trim())),
  JWT_ROLES_CLAIM: z.string().optional(),
  JWT_SCOPE_CLAIM: z.string().default('scope'),

  // ── Authorization (OPA) ─────────────────────────────────────────────────────
  OPA_ENABLED: z.string().default('false').transform(v => v === 'true'),
  OPA_URL: z.string().url().optional(),
  OPA_POLICY_PACKAGE: z.string().optional(),
  OPA_DECISION_TIMEOUT_MS: z.string().default('500').transform(Number),
  OPA_FAIL_OPEN: z.string().default('false').transform(v => v === 'true'),

  // ── Event Bus ────────────────────────────────────────────────────────────
  EVENT_BUS: z.enum(['sns']).default('sns'),
});

/**
 * Validates process.env at startup. The app will refuse to start if required
 * variables are missing or malformed (fail-fast, essential for ECS tasks).
 */
export function appConfig(env: Record<string, unknown>) {
  const result = schema.safeParse(env);

  if (!result.success) {
    const formatted = result.error.errors
      .map(e => `  [${e.path.join('.')}] ${e.message}`)
      .join('\n');

    throw new Error(`Configuration validation failed:\n${formatted}`);
  }

  // Enforce New Relic key when not using collector
  if (!result.data.OTEL_EXPORTER_OTLP_ENDPOINT && !result.data.NEW_RELIC_LICENSE_KEY) {
    throw new Error(
      'NEW_RELIC_LICENSE_KEY is required when OTEL_EXPORTER_OTLP_ENDPOINT is not set',
    );
  }

  // Enforce JWT config when auth is enabled
  if (result.data.AUTH_ENABLED) {
    const missing = ['JWT_ISSUER', 'JWT_AUDIENCE', 'JWKS_URI'].filter(k => !result.data[k as keyof typeof result.data]);
    if (missing.length) {
      throw new Error(`Authentication is enabled but required vars are missing: ${missing.join(', ')}`);
    }
  }

  // Enforce OPA config when OPA is enabled
  if (result.data.OPA_ENABLED) {
    const missing = ['OPA_URL', 'OPA_POLICY_PACKAGE'].filter(k => !result.data[k as keyof typeof result.data]);
    if (missing.length) {
      throw new Error(`OPA is enabled but required vars are missing: ${missing.join(', ')}`);
    }
  }

  // In production: auth must be on and fail-open must be off
  if (result.data.NODE_ENV === 'production') {
    if (!result.data.AUTH_ENABLED) {
      throw new Error('AUTH_ENABLED must be true in production');
    }
    if (result.data.OPA_FAIL_OPEN) {
      throw new Error('OPA_FAIL_OPEN must be false in production');
    }
  }

  return result.data;
}

export type AppConfig = z.infer<typeof schema>;
