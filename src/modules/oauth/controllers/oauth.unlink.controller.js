import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { oauthUnlinkService } from '../services/oauth.unlink.service.js';
import { oauthUnlinkParser } from '../parsers/oauth.unlink.parser.js';

export const oauthUnlinkController = asyncHandler(async (req, res) => {
  const result = await oauthUnlinkService({ provider: req.params.provider }, { userId: req.user.id });
  res.success(oauthUnlinkParser(result));
});
