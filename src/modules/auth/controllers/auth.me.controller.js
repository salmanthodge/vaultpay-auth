import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { meService } from '../services/auth.me.service.js';
import { meParser } from '../parsers/auth.me.parser.js';

export const meController = asyncHandler(async (req, res) => {
  const result = await meService({ userId: req.user.id });
  res.success(meParser(result));
});
