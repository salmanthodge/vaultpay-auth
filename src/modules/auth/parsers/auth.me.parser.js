/** Shapes the current-user profile + RBAC context. */
export const meParser = (result) => ({
  id: result.user.id,
  email: result.user.email,
  fullName: result.user.fullName,
  phone: result.user.phone,
  status: result.user.status,
  emailVerified: Boolean(result.user.emailVerifiedAt),
  lastLoginAt: result.user.lastLoginAt,
  createdAt: result.user.createdAt,
  roles: result.roles,
  permissions: result.permissions,
});
