export const verifyEmailConstant = {
  ROUTE: '/verify-email',
  RATE_LIMIT: { key: 'auth:verify-email', max: 20, windowSec: 60 },
};
