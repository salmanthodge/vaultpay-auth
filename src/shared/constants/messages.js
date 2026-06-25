import { errorCodes } from './errorCodes.js';

/** Human-readable messages keyed by error code (rules/04: messages live here, not inline). */
export const messages = Object.freeze({
  [errorCodes.INTERNAL_ERROR]: 'An unexpected error occurred.',
  [errorCodes.VALIDATION_ERROR]: 'Request validation failed.',
  [errorCodes.NOT_FOUND]: 'Resource not found.',
  [errorCodes.CONFLICT]: 'Resource conflict.',
  [errorCodes.RATE_LIMITED]: 'Too many requests. Please try again later.',
  [errorCodes.ENCRYPTION_ERROR]: 'Failed to process encrypted payload.',

  [errorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',
  [errorCodes.AUTH_TOKEN_MISSING]: 'Authentication token is missing.',
  [errorCodes.AUTH_TOKEN_INVALID]: 'Authentication token is invalid.',
  [errorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired.',
  [errorCodes.AUTH_REFRESH_INVALID]: 'Refresh token is invalid or has been revoked.',
  [errorCodes.AUTH_ACCOUNT_DISABLED]: 'This account is not active.',
  [errorCodes.AUTH_EMAIL_NOT_VERIFIED]: 'Email address has not been verified.',
  [errorCodes.EMAIL_TAKEN]: 'An account with this email already exists.',

  [errorCodes.AUTH_MFA_REQUIRED]: 'Multi-factor authentication is required.',
  [errorCodes.AUTH_MFA_INVALID]: 'Invalid multi-factor authentication code.',

  [errorCodes.TOKEN_INVALID_OR_EXPIRED]: 'This link is invalid or has expired.',

  [errorCodes.AUTH_SESSION_INVALID]: 'Session is invalid or has expired.',

  [errorCodes.FORBIDDEN]: 'You do not have permission to perform this action.',

  [errorCodes.S2S_UNAUTHORIZED]: 'Service-to-service authentication failed.',

  [errorCodes.OAUTH_PROVIDER_UNSUPPORTED]: 'Unsupported OAuth provider.',
  [errorCodes.OAUTH_STATE_INVALID]: 'OAuth state is invalid or has expired.',
  [errorCodes.OAUTH_EXCHANGE_FAILED]: 'Failed to complete OAuth sign-in.',
});
