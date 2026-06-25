/** Shapes the callback result: link confirmation or user + tokens (login). */
export const oauthCallbackParser = (result) => {
  if (result.linked) {
    return {
      linked: true,
      user: { id: result.user.id, email: result.user.email },
    };
  }
  return {
    linked: false,
    user: {
      id: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      status: result.user.status,
      emailVerified: Boolean(result.user.emailVerifiedAt),
    },
    roles: result.authContext.roles,
    permissions: result.authContext.permissions,
    tokens: { accessToken: result.accessToken, refreshToken: result.refreshToken },
  };
};
