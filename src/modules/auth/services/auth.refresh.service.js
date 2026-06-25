import { authRepository } from '../repositories/auth.repository.js';
import { issueTokens } from './auth.token.service.js';
import { verifyRefreshToken } from '../../../shared/utils/jwt.js';
import { sha256 } from '../../../shared/utils/hash.js';
import { isExpired } from '../../../shared/utils/date.js';
import { AuthError } from '../../../shared/errors/index.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Rotates a refresh token. Verifies signature + persisted record, detects reuse
 * of an already-revoked token (revokes the whole family), and issues a new pair
 * within the same family.
 *
 * @param {{ refreshToken: string }} input
 * @param {import('../types/auth.types.js').RequestContext} context
 */
export const refreshService = async ({ refreshToken }, context = {}) => {
  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError(errorCodes.AUTH_REFRESH_INVALID);
  }

  const record = await authRepository.findRefreshTokenByHash(sha256(refreshToken));
  if (!record) {
    throw new AuthError(errorCodes.AUTH_REFRESH_INVALID);
  }

  // Reuse of a revoked token => likely theft; revoke the entire family.
  if (record.revokedAt) {
    await authRepository.revokeRefreshTokenFamily(record.familyId);
    throw new AuthError(errorCodes.AUTH_REFRESH_INVALID);
  }

  if (isExpired(record.expiresAt)) {
    throw new AuthError(errorCodes.AUTH_REFRESH_INVALID);
  }

  const user = await authRepository.findUserById(record.userId);
  if (!user) {
    throw new AuthError(errorCodes.AUTH_REFRESH_INVALID);
  }

  const tokens = await issueTokens(user, {
    ip: context.ip,
    userAgent: context.userAgent,
    familyId: record.familyId,
  });

  // revoke the old token, chaining to its successor
  await authRepository.revokeRefreshToken(record.id, tokens.refreshId);

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: user.id,
    eventType: events.TOKEN_REFRESHED,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { user, ...tokens };
};
