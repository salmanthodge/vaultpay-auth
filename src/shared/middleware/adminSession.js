import { env } from '../config/env.js';
import { getAdminSession, refreshAdminSession } from '../services/session.js';
import { AuthError } from '../errors/index.js';
import { errorCodes } from '../constants/errorCodes.js';

/**
 * Admin authentication via httpOnly session cookie (rules/05). Validates the
 * session in Redis, applies sliding expiration, and attaches req.admin.
 * Requires cookie-parser to be mounted (wired in app.js).
 */
export const adminSession = async (req, _res, next) => {
  try {
    const sid = req.cookies?.[env.SESSION_COOKIE_NAME];
    if (!sid) throw new AuthError(errorCodes.AUTH_SESSION_INVALID);

    const session = await getAdminSession(sid);
    if (!session) throw new AuthError(errorCodes.AUTH_SESSION_INVALID);

    await refreshAdminSession(sid);

    req.admin = { id: session.adminId, role: session.role, email: session.email };
    req.sessionId = sid;
    return next();
  } catch (err) {
    return next(err);
  }
};
