import pino from 'pino';
import { env, isDevelopment } from './env.js';

/**
 * Centralized pino logger.
 * - pretty output in development, structured JSON in production
 * - redacts secrets/tokens/passwords so they never reach logs (rules/05)
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: env.SERVICE_NAME },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      'passwordHash',
      '*.passwordHash',
      'token',
      '*.token',
      'accessToken',
      'refreshToken',
      'secret',
      '*.secret',
    ],
    censor: '[redacted]',
  },
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
        },
      }
    : {}),
});
