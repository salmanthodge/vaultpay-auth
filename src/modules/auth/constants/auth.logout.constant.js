export const logoutConstant = {
  ROUTE: '/logout',
  RATE_LIMIT: { key: 'auth:logout', max: 30, windowSec: 60 },
};
