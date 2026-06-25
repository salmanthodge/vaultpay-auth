import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { loginService } from '../services/auth.login.service.js';
import { loginParser } from '../parsers/auth.login.parser.js';

export const loginController = asyncHandler(async (req, res) => {
  const result = await loginService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.success(loginParser(result));
});
