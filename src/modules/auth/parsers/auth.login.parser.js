/** Shapes the login result: either an MFA challenge or the user + tokens. */
export const loginParser = (result) => {
  if (result.mfaRequired) {
    return { mfaRequired: true, mfaToken: result.mfaToken };
  }
  return {
    mfaRequired: false,
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
  };
};
