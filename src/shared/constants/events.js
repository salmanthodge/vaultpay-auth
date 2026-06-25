/** Domain event names emitted via the shared event emitter (rules/01 events/). */
export const events = Object.freeze({
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGIN_FAILED: 'user.login_failed',
  USER_LOGGED_OUT: 'user.logged_out',
  TOKEN_REFRESHED: 'user.token_refreshed',
  EMAIL_VERIFIED: 'user.email_verified',
  PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  PASSWORD_RESET: 'user.password_reset',
  PASSWORD_CHANGED: 'user.password_changed',
  MFA_ENABLED: 'user.mfa_enabled',
  MFA_DISABLED: 'user.mfa_disabled',
  OAUTH_LINKED: 'user.oauth_linked',
  ADMIN_LOGGED_IN: 'admin.logged_in',
  ADMIN_LOGGED_OUT: 'admin.logged_out',
});
