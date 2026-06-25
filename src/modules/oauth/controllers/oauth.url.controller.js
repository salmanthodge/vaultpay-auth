import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { oauthUrlService } from '../services/oauth.url.service.js';
import { oauthUrlParser } from '../parsers/oauth.url.parser.js';

export const oauthUrlController = asyncHandler(async (req, res) => {
  const result = await oauthUrlService({ provider: req.params.provider });
  res.success(oauthUrlParser(result));
});
