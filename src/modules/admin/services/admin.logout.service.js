import { authRepository } from '../../auth/repositories/auth.repository.js';
import { destroyAdminSession } from '../../../shared/services/session.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Destroys the admin session.
 *
 * @param {{ sessionId: string, adminId: string, ip?: string, userAgent?: string }} context
 */
export const adminLogoutService = async (_input, context) => {
  if (context.sessionId) {
    await destroyAdminSession(context.sessionId);
  }
  await authRepository.createAuthEvent({
    actorType: actorTypes.ADMIN,
    actorId: context.adminId,
    eventType: events.ADMIN_LOGGED_OUT,
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
  });
  return { loggedOut: true };
};
