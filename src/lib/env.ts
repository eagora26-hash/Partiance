import { z } from 'zod';

/**
 * Centralized, validated environment configuration (runtime_rules: configs centralized,
 * secrets via env, never expose keys). Validated once at import time so a misconfigured
 * deploy fails fast and loudly instead of breaking deep in a request.
 *
 * Optional SaaS keys are intentionally optional: the app runs fully on local providers
 * when they're absent, and upgrades to the real provider the moment a key is present.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Core (required for the app to run at all)
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://partiance:partiance@localhost:5434/partiance?schema=public'),
  APP_URL: z.string().url().default('http://localhost:3000'),

  // Auth.js
  AUTH_SECRET: z.string().min(1).default('dev-insecure-secret-change-me-in-production'),
  AUTH_TRUST_HOST: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),

  // OAuth (optional — providers light up only when both id+secret present)
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),

  // Payments — Stripe (optional; falls back to local provider)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Email — Resend (optional; falls back to SMTP/MailHog in dev)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Partiance <no-reply@partiance.it>'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Analytics — PostHog (optional; falls back to no-op)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://eu.posthog.com'),

  // Monitoring — Sentry (optional; falls back to no-op)
  SENTRY_DSN: z.string().optional(),

  // AI — provider-agnostic (optional; falls back to deterministic/rule-based)
  AI_API_KEY: z.string().optional(),
});

type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}

export const env = loadEnv();

/** Feature flags derived from which secrets are present. */
export const features = {
  stripe: Boolean(env.STRIPE_SECRET_KEY),
  resend: Boolean(env.RESEND_API_KEY),
  posthog: Boolean(env.NEXT_PUBLIC_POSTHOG_KEY),
  sentry: Boolean(env.SENTRY_DSN),
  ai: Boolean(env.AI_API_KEY),
  googleAuth: Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET),
  githubAuth: Boolean(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET),
} as const;
