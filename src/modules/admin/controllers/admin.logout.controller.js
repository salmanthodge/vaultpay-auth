import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { adminLogoutService } from '../services/admin.logout.service.js';
import { adminLogoutParser } from '../parsers/admin.logout.parser.js';
import { adminCookie } from '../constants/admin.cookie.constant.js';

export const adminLogoutController = asyncHandler(async (req, res) => {
  const result = await adminLogoutService(
    {},
    {
      sessionId: req.sessionId,
      adminId: req.admin.id,
      ip: req.clientIp,
      userAgent: req.headers['user-agent'],
    },
  );
  res.clearCookie(adminCookie.NAME, adminCookie.clearOptions);
  res.success(adminLogoutParser(result));
});
