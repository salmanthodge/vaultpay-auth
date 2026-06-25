import { redis } from '../config/redis.js';
import { env } from '../config/env.js';
import { randomToken } from '../utils/hash.js';

/**
 * Admin session store (Redis-backed, rules/05). Sessions are opaque ids kept in
 * Redis with a sliding TTL; the id travels in an httpOnly cookie.
 */
const sessionKey = (sid) => `admin:session:${sid}`;

export const createAdminSession = async (data) => {
  const sid = randomToken(24);
  await redis.set(sessionKey(sid), JSON.stringify(data), 'EX', env.SESSION_TTL_SECONDS);
  return sid;
};

export const getAdminSession = async (sid) => {
  const raw = await redis.get(sessionKey(sid));
  return raw ? JSON.parse(raw) : null;
};

export const refreshAdminSession = (sid) => redis.expire(sessionKey(sid), env.SESSION_TTL_SECONDS);

export const destroyAdminSession = (sid) => redis.del(sessionKey(sid));
