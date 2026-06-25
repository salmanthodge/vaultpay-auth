import { ForbiddenError } from '../errors/index.js';

/**
 * Admin authorization gate (runs after adminSession). Default-deny; SUPER_ADMIN
 * bypasses. Mirrors rbac() but for session-based admins (req.admin).
 *
 * @param {...string} allowed admin roles permitted
 */
export const adminRole =
  (...allowed) =>
  (req, _res, next) => {
    const role = req.admin?.role;
    if (!role) return next(new ForbiddenError());
    if (role === 'SUPER_ADMIN' || allowed.includes(role)) return next();
    return next(new ForbiddenError());
  };
