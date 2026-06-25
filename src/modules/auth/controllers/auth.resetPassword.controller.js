import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { resetPasswordService } from '../services/auth.resetPassword.service.js';
import { resetPasswordParser } from '../parsers/auth.resetPassword.parser.js';

export const resetPasswordController = asyncHandler(async (req, res) => {
  const result = await resetPasswordService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.success(resetPasswordParser(result));
});
