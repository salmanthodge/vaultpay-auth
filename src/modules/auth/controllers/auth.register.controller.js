import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { registerService } from '../services/auth.register.service.js';
import { registerParser } from '../parsers/auth.register.parser.js';

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.created(registerParser(user));
});
