import { authRepository } from '../repositories/auth.repository.js';
import { sha256 } from '../../../shared/utils/hash.js';
import { redis } from '../../../shared/config/redis.js';
import { nowSeconds } from '../../../shared/utils/date.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Logs a customer out: revokes the presented refresh token and deny-lists the
 * current access token's jti in Redis until it would naturally expire.
 *
 * @param {{ refreshToken: string }} input
 * @param {{ userId: string, accessJti?: string, accessExp?: number, ip?: string, userAgent?: string }} context
 */
export const logoutService = async ({ refreshToken }, context = {}) => {
  const record = await authRepository.findRefreshTokenByHash(sha256(refreshToken));
  if (record && !record.revokedAt) {
    await authRepository.revokeRefreshToken(record.id);
  }

  if (context.accessJti && context.accessExp) {
    const ttl = Math.max(context.accessExp - nowSeconds(), 1);
    await redis.set(`denylist:access:${context.accessJti}`, '1', 'EX', ttl);
  }

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: context.userId,
    eventType: events.USER_LOGGED_OUT,
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { loggedOut: true };
};
