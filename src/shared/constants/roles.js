/** Customer-facing roles (RBAC source of truth lives in auth-service). */
export const roles = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
});

/** Admin (back-office) roles — used by session-based admin auth. */
export const adminRoles = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUPPORT: 'SUPPORT',
  AUDITOR: 'AUDITOR',
});

/** Actor types recorded in auth_events. */
export const actorTypes = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SERVICE: 'SERVICE',
});
