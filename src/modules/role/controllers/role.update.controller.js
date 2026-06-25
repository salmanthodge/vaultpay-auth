import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { roleUpdateService } from '../services/role.update.service.js';
import { roleDetailParser } from '../parsers/role.detail.parser.js';

export const roleUpdateController = asyncHandler(async (req, res) => {
  const result = await roleUpdateService({ id: req.params.id }, req.body);
  res.success(roleDetailParser(result));
});
