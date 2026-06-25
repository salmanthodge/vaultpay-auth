import { authRepository } from '../repositories/auth.repository.js';
import { sha256, randomToken } from '../../../shared/utils/hash.js';
import { addMinutes } from '../../../shared/utils/date.js';
import { sendPasswordResetEmail } from '../../../shared/services/email.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';
import { forgotPasswordConstant } from '../constants/auth.forgotPassword.constant.js';

/**
 * Issues a password-reset token by email. Always resolves the same way whether or
 * not the email exists (no account enumeration, rules/05).
 *
 * @param {{ email: string }} input
 * @param {import('../types/auth.types.js').RequestContext} context
 */
export const forgotPasswordService = async ({ email }, context = {}) => {
  const user = await authRepository.findUserByEmail(email);

  if (user) {
    const rawToken = randomToken(32);
    await authRepository.createPasswordReset({
      userId: user.id,
      tokenHash: sha256(rawToken),
      expiresAt: addMinutes(new Date(), forgotPasswordConstant.RESET_TTL_MINUTES),
    });
    await sendPasswordResetEmail({ to: user.email, token: rawToken });

    await authRepository.createAuthEvent({
      actorType: actorTypes.CUSTOMER,
      actorId: user.id,
      eventType: events.PASSWORD_RESET_REQUESTED,
      ip: context.ip ?? null,
      geoCountry: context.geo?.country ?? null,
      userAgent: context.userAgent ?? null,
    });
  }

  return { requested: true };
};
