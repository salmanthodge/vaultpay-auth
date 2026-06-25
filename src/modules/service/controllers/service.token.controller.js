import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { serviceTokenService } from '../services/service.token.service.js';
import { serviceTokenParser } from '../parsers/service.token.parser.js';

export const serviceTokenController = asyncHandler(async (req, res) => {
  const result = await serviceTokenService(req.body);
  res.success(serviceTokenParser(result));
});
