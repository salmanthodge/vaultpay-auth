import { authRepository } from '../repositories/auth.repository.js';
import { hashPassword, sha256, randomToken } from '../../../shared/utils/hash.js';
import { addHours } from '../../../shared/utils/date.js';
import { AppError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { roles as roleNames, actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';
import { sendVerificationEmail } from '../../../shared/services/email.js';
import { registerConstant } from '../constants/auth.register.constant.js';

/**
 * Registers a customer: creates the user (PENDING), assigns the default CUSTOMER
 * role, issues an email-verification token, and records an audit event.
 *
 * @param {{ email: string, password: string, fullName?: string, phone?: string }} input
 * @param {import('../types/auth.types.js').RequestContext} context
 */
export const registerService = async ({ email, password, fullName, phone }, context = {}) => {
  const existing = await authRepository.findUserByEmail(email);
  if (existing) {
    throw new AppError(
      'An account with this email already exists.',
      httpStatus.CONFLICT,
      errorCodes.EMAIL_TAKEN,
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await authRepository.createUser({
    email,
    passwordHash,
    fullName: fullName ?? null,
    phone: phone ?? null,
  });

  const customerRole = await authRepository.findRoleByName(roleNames.CUSTOMER);
  if (customerRole) {
    await authRepository.assignRole(user.id, customerRole.id);
  }

  const rawToken = randomToken(32);
  await authRepository.createEmailVerification({
    userId: user.id,
    tokenHash: sha256(rawToken),
    expiresAt: addHours(new Date(), registerConstant.EMAIL_VERIFICATION_TTL_HOURS),
  });
  await sendVerificationEmail({ to: user.email, token: rawToken });

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: user.id,
    eventType: events.USER_REGISTERED,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return user;
};
