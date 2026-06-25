import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { mfaEnableService } from '../services/mfa.enable.service.js';
import { mfaEnableParser } from '../parsers/mfa.enable.parser.js';

export const mfaEnableController = asyncHandler(async (req, res) => {
  const result = await mfaEnableService(req.body, {
    userId: req.user.id,
    ip: req.clientIp,
    userAgent: req.headers['user-agent'],
  });
  res.success(mfaEnableParser(result));
});
