import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { verifyEmailService } from '../services/auth.verifyEmail.service.js';
import { verifyEmailParser } from '../parsers/auth.verifyEmail.parser.js';

export const verifyEmailController = asyncHandler(async (req, res) => {
  const result = await verifyEmailService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.success(verifyEmailParser(result));
});
