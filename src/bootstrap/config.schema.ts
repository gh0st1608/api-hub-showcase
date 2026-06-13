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
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),

  PROJECT_REPOSITORY_DRIVER: z
    .enum(['memory', 'typeorm', 'dynamo'])
    .default('memory'),

  FILE_STORAGE_DRIVER: z
    .enum(['local', 's3'])
    .default('local'),

  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_ENDPOINT: z.string().url().optional(),
  AWS_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  AWS_S3_FORCE_PATH_STYLE: z
    .string()
    .default('false')
    .transform(v => v === 'true'),
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

  if (result.data.PROJECT_REPOSITORY_DRIVER === 'typeorm') {
    const missing = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'].filter(
      key => !result.data[key as keyof typeof result.data],
    );

    if (missing.length) {
      throw new Error(
        `TypeORM project repository requires vars: ${missing.join(', ')}`,
      );
    }
  }

  if (result.data.FILE_STORAGE_DRIVER === 's3' && !result.data.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET is required when FILE_STORAGE_DRIVER is s3');
  }

  const isRunningInLambda =
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.AWS_EXECUTION_ENV?.startsWith('AWS_Lambda');

  if (isRunningInLambda) {
    if (result.data.FILE_STORAGE_DRIVER !== 's3') {
      throw new Error('FILE_STORAGE_DRIVER must be s3 when running in AWS Lambda');
    }

    if (result.data.PROJECT_REPOSITORY_DRIVER !== 'typeorm') {
      throw new Error(
        'PROJECT_REPOSITORY_DRIVER must be typeorm when running in AWS Lambda',
      );
    }
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
