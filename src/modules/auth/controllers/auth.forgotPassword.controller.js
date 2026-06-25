import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { forgotPasswordService } from '../services/auth.forgotPassword.service.js';
import { forgotPasswordParser } from '../parsers/auth.forgotPassword.parser.js';

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const result = await forgotPasswordService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.success(forgotPasswordParser(result));
});
