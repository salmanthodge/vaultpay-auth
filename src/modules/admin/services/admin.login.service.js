import { adminRepository } from '../repositories/admin.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { comparePassword } from '../../../shared/utils/hash.js';
import { createAdminSession } from '../../../shared/services/session.js';
import { env } from '../../../shared/config/env.js';
import { AuthError } from '../../../shared/errors/index.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Authenticates an admin and creates a server-side session (rules/05). Returns
 * the session id so the controller can set the httpOnly cookie.
 *
 * @param {{ email: string, password: string }} input
 * @param {import('../../auth/types/auth.types.js').RequestContext} context
 */
export const adminLoginService = async ({ email, password }, context = {}) => {
  const admin = await adminRepository.findByEmail(email);
  if (!admin) {
    throw new AuthError(errorCodes.AUTH_INVALID_CREDENTIALS);
  }

  const passwordOk = await comparePassword(password, admin.passwordHash);
  if (!passwordOk) {
    throw new AuthError(errorCodes.AUTH_INVALID_CREDENTIALS);
  }

  if (admin.status !== 'ACTIVE') {
    throw new AuthError(errorCodes.AUTH_ACCOUNT_DISABLED);
  }

  const sid = await createAdminSession({ adminId: admin.id, role: admin.role, email: admin.email });
  await adminRepository.updateLastLogin(admin.id);

  await authRepository.createAuthEvent({
    actorType: actorTypes.ADMIN,
    actorId: admin.id,
    eventType: events.ADMIN_LOGGED_IN,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { sid, admin, expiresIn: env.SESSION_TTL_SECONDS };
};
