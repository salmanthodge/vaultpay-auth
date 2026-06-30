/** Shapes the email-verification result: verified flag + an auto-login session. */
export const verifyEmailParser = (result) => ({
  verified: true,
  user: {
    id: result.user.id,
    email: result.user.email,
    fullName: result.user.fullName,
    status: result.user.status,
    emailVerified: Boolean(result.user.emailVerifiedAt),
  },
  roles: result.authContext.roles,
  permissions: result.authContext.permissions,
  tokens: {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  },
});
