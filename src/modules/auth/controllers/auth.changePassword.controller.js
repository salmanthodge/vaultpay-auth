import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { changePasswordService } from '../services/auth.changePassword.service.js';
import { changePasswordParser } from '../parsers/auth.changePassword.parser.js';

export const changePasswordController = asyncHandler(async (req, res) => {
  const result = await changePasswordService(req.body, {
    userId: req.user.id,
    ip: req.clientIp,
    userAgent: req.headers['user-agent'],
  });
  res.success(changePasswordParser(result));
});
