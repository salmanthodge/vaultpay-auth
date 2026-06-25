import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { roleCreateService } from '../services/role.create.service.js';
import { roleDetailParser } from '../parsers/role.detail.parser.js';

export const roleCreateController = asyncHandler(async (req, res) => {
  const result = await roleCreateService(req.body);
  res.created(roleDetailParser(result));
});
