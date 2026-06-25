import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { adminSessionService } from '../services/admin.session.service.js';
import { adminSessionParser } from '../parsers/admin.session.parser.js';

export const adminSessionController = asyncHandler(async (req, res) => {
  const result = await adminSessionService({ adminId: req.admin.id });
  res.success(adminSessionParser(result));
});
