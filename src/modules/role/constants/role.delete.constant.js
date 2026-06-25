export const roleDeleteConstant = {
  ROUTE: '/roles/:id',
  RATE_LIMIT: { key: 'role:delete', max: 20, windowSec: 60 },
};
