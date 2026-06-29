export const serviceUserGetConstant = {
  ROUTE: '/users/:id',
  RATE_LIMIT: { key: 'service:user-get', max: 120, windowSec: 60 },
};
