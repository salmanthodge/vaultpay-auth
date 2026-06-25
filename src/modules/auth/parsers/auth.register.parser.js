/** Shapes a created user row into the public API response (rules/03). */
export const registerParser = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  phone: user.phone,
  status: user.status,
  emailVerified: Boolean(user.emailVerifiedAt),
  createdAt: user.createdAt,
});
