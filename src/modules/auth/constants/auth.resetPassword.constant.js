export const resetPasswordConstant = {
  ROUTE: '/reset-password',
  RATE_LIMIT: { key: 'auth:reset-password', max: 10, windowSec: 60 },
};
