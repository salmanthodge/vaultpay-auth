export const serviceUserStatusConstant = {
  ROUTE: '/users/:id/status',
  RATE_LIMIT: { key: 'service:user-status', max: 60, windowSec: 60 },
};
