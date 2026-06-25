import { authRepository } from '../repositories/auth.repository.js';
import { comparePassword, hashPassword } from '../../../shared/utils/hash.js';
import { AuthError, NotFoundError } from '../../../shared/errors/index.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Changes the authenticated user's password after verifying the current one.
 * Revokes other active refresh tokens for safety.
 *
 * @param {{ currentPassword: string, newPassword: string }} input
 * @param {{ userId: string, ip?: string, userAgent?: string }} context
 */
export const changePasswordService = async ({ currentPassword, newPassword }, context = {}) => {
  const user = await authRepository.findUserById(context.userId);
  if (!user) {
    throw new NotFoundError();
  }

  const ok = user.passwordHash && (await comparePassword(currentPassword, user.passwordHash));
  if (!ok) {
    throw new AuthError(errorCodes.AUTH_INVALID_CREDENTIALS);
  }

  const passwordHash = await hashPassword(newPassword);
  await authRepository.updateUser(user.id, { passwordHash });
  await authRepository.revokeAllUserRefreshTokens(user.id);

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: user.id,
    eventType: events.PASSWORD_CHANGED,
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { changed: true };
};
