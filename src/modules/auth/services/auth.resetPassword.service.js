import { authRepository } from '../repositories/auth.repository.js';
import { sha256, hashPassword } from '../../../shared/utils/hash.js';
import { isExpired } from '../../../shared/utils/date.js';
import { AppError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Resets a password using a single-use token. Revokes all active refresh tokens
 * so existing sessions are forced to re-authenticate.
 *
 * @param {{ token: string, password: string }} input
 * @param {import('../types/auth.types.js').RequestContext} context
 */
export const resetPasswordService = async ({ token, password }, context = {}) => {
  const record = await authRepository.findPasswordResetByHash(sha256(token));
  if (!record || record.consumedAt || isExpired(record.expiresAt)) {
    throw new AppError(
      'This link is invalid or has expired.',
      httpStatus.BAD_REQUEST,
      errorCodes.TOKEN_INVALID_OR_EXPIRED,
    );
  }

  const passwordHash = await hashPassword(password);
  await authRepository.updateUser(record.userId, { passwordHash });
  await authRepository.consumePasswordReset(record.id);
  await authRepository.revokeAllUserRefreshTokens(record.userId);

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: record.userId,
    eventType: events.PASSWORD_RESET,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { reset: true };
};
