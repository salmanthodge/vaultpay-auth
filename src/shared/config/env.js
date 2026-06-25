import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/** Coerce "true"/"false" strings into real booleans before validation. */
const booleanFromString = (defaultValue) =>
  z
    .preprocess((value) => {
      if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
      return value;
    }, z.boolean())
    .default(defaultValue);

/** Comma-separated string -> trimmed string array. */
const csv = (defaultValue = '') =>
  z
    .string()
    .default(defaultValue)
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );

const schema = z.object({
  // runtime
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4001),
  SERVICE_NAME: z.string().default('auth-service'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  // datastores
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  // customer JWT
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),

  // admin session
  SESSION_SECRET: z.string().min(8),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
  SESSION_COOKIE_NAME: z.string().default('vaultpay_admin_sid'),

  // service-to-service
  S2S_SECRET: z.string().min(8),
  S2S_TOKEN_TTL: z.string().default('60s'),

  // encryption middleware toggle
  ENCRYPTION_ENABLED: booleanFromString(false),
  ENCRYPTION_KEY: z.string().min(32),

  // mfa
  MFA_ISSUER: z.string().default('VaultPay'),

  // oauth (optional until configured)
  OAUTH_REDIRECT_BASE_URL: z.string().url(),
  OAUTH_GOOGLE_CLIENT_ID: z.string().default(''),
  OAUTH_GOOGLE_CLIENT_SECRET: z.string().default(''),
  OAUTH_GITHUB_CLIENT_ID: z.string().default(''),
  OAUTH_GITHUB_CLIENT_SECRET: z.string().default(''),

  // email (Mailtrap + Nodemailer)
  MAIL_HOST: z.string().default('sandbox.smtp.mailtrap.io'),
  MAIL_PORT: z.coerce.number().int().positive().default(2525),
  MAIL_USER: z.string().default(''),
  MAIL_PASS: z.string().default(''),
  MAIL_FROM: z.string().default('VaultPay <no-reply@vaultpay.local>'),

  // rate limiting
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  // cors
  CORS_ORIGINS: csv('http://localhost:3000'),

  // cluster
  CLUSTER_ENABLED: booleanFromString(false),
  CLUSTER_WORKERS: z.coerce.number().int().min(0).default(0),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // fail fast: env is invalid, do not let the service boot in a bad state.
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`[env] Invalid environment configuration:\n${issues}`);
  process.exit(1);
}

export const env = Object.freeze(parsed.data);

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
