import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { roleAssignUserService } from '../services/role.assignUser.service.js';
import { roleAssignUserParser } from '../parsers/role.assignUser.parser.js';

export const roleAssignUserController = asyncHandler(async (req, res) => {
  const result = await roleAssignUserService({ userId: req.params.userId }, req.body);
  res.success(roleAssignUserParser(result));
});
