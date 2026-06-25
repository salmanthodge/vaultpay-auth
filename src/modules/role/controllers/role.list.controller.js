import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { roleListService } from '../services/role.list.service.js';
import { roleListParser } from '../parsers/role.list.parser.js';

export const roleListController = asyncHandler(async (req, res) => {
  const result = await roleListService(req.query);
  res.success(roleListParser(result), result.meta);
});
