/** Shapes the current admin session profile. */
export const adminSessionParser = (result) => ({
  id: result.admin.id,
  email: result.admin.email,
  fullName: result.admin.fullName,
  role: result.admin.role,
  status: result.admin.status,
  lastLoginAt: result.admin.lastLoginAt,
});
