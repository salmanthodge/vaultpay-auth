import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { deviceListService } from '../services/device.list.service.js';
import { deviceListParser } from '../parsers/device.list.parser.js';

export const deviceListController = asyncHandler(async (req, res) => {
  const result = await deviceListService({ userId: req.user.id });
  res.success(deviceListParser(result));
});
