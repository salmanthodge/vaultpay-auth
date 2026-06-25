export const changePasswordConstant = {
  ROUTE: '/change-password',
  RATE_LIMIT: { key: 'auth:change-password', max: 10, windowSec: 60 },
};
