import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { serviceIntrospectService } from '../services/service.introspect.service.js';
import { serviceIntrospectParser } from '../parsers/service.introspect.parser.js';

export const serviceIntrospectController = asyncHandler(async (req, res) => {
  const result = await serviceIntrospectService(req.body);
  res.success(serviceIntrospectParser(result));
});
