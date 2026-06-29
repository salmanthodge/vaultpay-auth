/** Shapes a user row for S2S consumers (admin-service). */
export const serviceUserParser = (result) => ({
  id: result.user.id,
  email: result.user.email,
  fullName: result.user.fullName,
  phone: result.user.phone,
  status: result.user.status,
  emailVerified: Boolean(result.user.emailVerifiedAt),
  createdAt: result.user.createdAt,
  lastLoginAt: result.user.lastLoginAt,
});
