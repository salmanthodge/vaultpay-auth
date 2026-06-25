export const adminLogoutConstant = {
  ROUTE: '/logout',
  RATE_LIMIT: { key: 'admin:logout', max: 30, windowSec: 60 },
};
