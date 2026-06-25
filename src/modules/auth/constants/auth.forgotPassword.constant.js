export const forgotPasswordConstant = {
  ROUTE: '/forgot-password',
  RATE_LIMIT: { key: 'auth:forgot-password', max: 5, windowSec: 60 },
  RESET_TTL_MINUTES: 30,
};
