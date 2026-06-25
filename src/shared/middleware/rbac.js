import { ForbiddenError } from '../errors/index.js';

/**
 * Role/permission gate (rules/05). Runs AFTER auth. Default-deny: the user must
 * hold ALL listed permissions. SUPER_ADMIN bypasses checks.
 *
 * @param {...string} required permission codes
 */
export const rbac =
  (...required) =>
  (req, _res, next) => {
    const user = req.user;
    if (!user) return next(new ForbiddenError());

    if (user.role === 'SUPER_ADMIN') return next();
    if (required.length === 0) return next();

    const held = new Set(user.permissions ?? []);
    const ok = required.every((permission) => held.has(permission));

    return ok ? next() : next(new ForbiddenError());
  };
