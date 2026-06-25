import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { adminLoginService } from '../services/admin.login.service.js';
import { adminLoginParser } from '../parsers/admin.login.parser.js';
import { adminCookie } from '../constants/admin.cookie.constant.js';

export const adminLoginController = asyncHandler(async (req, res) => {
  const result = await adminLoginService(req.body, {
    ip: req.clientIp,
    geo: req.geo,
    userAgent: req.headers['user-agent'],
  });
  res.cookie(adminCookie.NAME, result.sid, adminCookie.options);
  res.success(adminLoginParser(result));
});
