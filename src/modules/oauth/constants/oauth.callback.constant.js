export const oauthCallbackConstant = {
  ROUTE: '/:provider/callback',
  RATE_LIMIT: { key: 'oauth:callback', max: 20, windowSec: 60 },
};
