import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { mfaVerifyService } from '../services/mfa.verify.service.js';
import { mfaVerifyParser } from '../parsers/mfa.verify.parser.js';

export const mfaVerifyController = asyncHandler(async (req, res) => {
  const result = await mfaVerifyService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.success(mfaVerifyParser(result));
});
