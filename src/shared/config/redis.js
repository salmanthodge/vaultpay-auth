import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

/**
 * Redis singleton — backs admin sessions, refresh-token deny-list, rate limiting,
 * OAuth state and MFA challenge tokens (rules/05).
 *
 * maxRetriesPerRequest: null keeps commands queued during brief reconnects instead
 * of failing fast, which suits session/rate-limit workloads.
 */
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on('connect', () => logger.info('redis connected'));
redis.on('ready', () => logger.debug('redis ready'));
redis.on('error', (err) => logger.error({ err: err.message }, 'redis error'));
redis.on('close', () => logger.warn('redis connection closed'));

/** Graceful shutdown. */
export const disconnectRedis = async () => {
  await redis.quit();
  logger.info('redis disconnected');
};
