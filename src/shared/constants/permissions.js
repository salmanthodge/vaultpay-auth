/** Granular permission codes checked by the rbac middleware (rules/05). */
export const permissions = Object.freeze({
  // user management
  USER_READ: 'USER_READ',
  USER_WRITE: 'USER_WRITE',

  // role / permission management
  ROLE_READ: 'ROLE_READ',
  ROLE_WRITE: 'ROLE_WRITE',
  ROLE_DELETE: 'ROLE_DELETE',
  PERMISSION_READ: 'PERMISSION_READ',

  // service-client management
  SERVICE_CLIENT_READ: 'SERVICE_CLIENT_READ',
  SERVICE_CLIENT_WRITE: 'SERVICE_CLIENT_WRITE',

  // audit
  AUDIT_READ: 'AUDIT_READ',
});
