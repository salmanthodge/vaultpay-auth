import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { logoutService } from '../services/auth.logout.service.js';
import { logoutParser } from '../parsers/auth.logout.parser.js';

export const logoutController = asyncHandler(async (req, res) => {
  const result = await logoutService(req.body, {
    userId: req.user.id,
    accessJti: req.user.jti,
    accessExp: req.user.exp,
    ip: req.clientIp,
    userAgent: req.headers['user-agent'],
  });
  res.success(logoutParser(result));
});
