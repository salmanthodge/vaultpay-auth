import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { serviceUserGetService } from '../services/service.userGet.service.js';
import { serviceUserParser } from '../parsers/service.user.parser.js';

export const serviceUserGetController = asyncHandler(async (req, res) => {
  const result = await serviceUserGetService({ id: req.params.id });
  res.success(serviceUserParser(result));
});
