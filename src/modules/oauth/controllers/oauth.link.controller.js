import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { oauthLinkService } from '../services/oauth.link.service.js';
import { oauthLinkParser } from '../parsers/oauth.link.parser.js';

export const oauthLinkController = asyncHandler(async (req, res) => {
  const result = await oauthLinkService({ provider: req.params.provider }, { userId: req.user.id });
  res.success(oauthLinkParser(result));
});
