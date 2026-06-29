import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { serviceUserStatusService } from '../services/service.userStatus.service.js';
import { serviceUserParser } from '../parsers/service.user.parser.js';

export const serviceUserStatusController = asyncHandler(async (req, res) => {
  const result = await serviceUserStatusService({ id: req.params.id }, req.body);
  res.success(serviceUserParser(result));
});
