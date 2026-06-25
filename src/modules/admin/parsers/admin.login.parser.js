/** Shapes the admin login result (the session id is sent as a cookie, not in the body). */
export const adminLoginParser = (result) => ({
  admin: {
    id: result.admin.id,
    email: result.admin.email,
    fullName: result.admin.fullName,
    role: result.admin.role,
    status: result.admin.status,
  },
  expiresIn: result.expiresIn,
});
