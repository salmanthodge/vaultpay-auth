export const loginConstant = {
  ROUTE: '/login',
  RATE_LIMIT: { key: 'auth:login', max: 5, windowSec: 60 },
  MFA_CHALLENGE_TTL_SECONDS: 300,
};
