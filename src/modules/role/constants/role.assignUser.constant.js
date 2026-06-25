export const roleAssignUserConstant = {
  ROUTE: '/users/:userId/roles',
  RATE_LIMIT: { key: 'role:assign', max: 30, windowSec: 60 },
};
