/** Module-wide OAuth provider configuration (free providers only). */
export const oauthProviders = {
  STATE_TTL_SECONDS: 600,
  PROVIDERS: {
    GOOGLE: {
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
      scope: 'openid email profile',
    },
    GITHUB: {
      authorizeUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      emailUrl: 'https://api.github.com/user/emails',
      scope: 'read:user user:email',
    },
  },
};
