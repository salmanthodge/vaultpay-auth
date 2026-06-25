import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { roleDeleteService } from '../services/role.delete.service.js';
import { roleDeleteParser } from '../parsers/role.delete.parser.js';

export const roleDeleteController = asyncHandler(async (req, res) => {
  const result = await roleDeleteService({ id: req.params.id });
  res.success(roleDeleteParser(result));
});
