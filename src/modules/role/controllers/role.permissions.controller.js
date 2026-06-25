import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { permissionListService } from '../services/role.permissions.service.js';
import { permissionListParser } from '../parsers/role.permissions.parser.js';

export const permissionListController = asyncHandler(async (_req, res) => {
  const result = await permissionListService();
  res.success(permissionListParser(result));
});
