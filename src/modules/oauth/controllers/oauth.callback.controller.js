import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { oauthCallbackService } from '../services/oauth.callback.service.js';
import { oauthCallbackParser } from '../parsers/oauth.callback.parser.js';

export const oauthCallbackController = asyncHandler(async (req, res) => {
  const result = await oauthCallbackService(
    { provider: req.params.provider, code: req.query.code, state: req.query.state },
    { ip: req.clientIp, geo: req.geo, userAgent: req.headers['user-agent'] },
  );
  res.success(oauthCallbackParser(result));
});
