import { authRepository } from '../repositories/auth.repository.js';
import { sha256 } from '../../../shared/utils/hash.js';
import { isExpired } from '../../../shared/utils/date.js';
import { AppError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Consumes an email-verification token: activates the account and marks the
 * email verified. Token is single-use and time-limited.
 *
 * @param {{ token: string }} input
 * @param {import('../types/auth.types.js').RequestContext} context
 */
export const verifyEmailService = async ({ token }, context = {}) => {
  const record = await authRepository.findEmailVerificationByHash(sha256(token));
  if (!record || record.consumedAt || isExpired(record.expiresAt)) {
    throw new AppError(
      'This link is invalid or has expired.',
      httpStatus.BAD_REQUEST,
      errorCodes.TOKEN_INVALID_OR_EXPIRED,
    );
  }

  await authRepository.consumeEmailVerification(record.id);
  const user = await authRepository.updateUser(record.userId, {
    emailVerifiedAt: new Date(),
    status: 'ACTIVE',
  });

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: user.id,
    eventType: events.EMAIL_VERIFIED,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { user };
};
