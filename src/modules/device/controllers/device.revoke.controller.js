import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { deviceRevokeService } from '../services/device.revoke.service.js';
import { deviceRevokeParser } from '../parsers/device.revoke.parser.js';

export const deviceRevokeController = asyncHandler(async (req, res) => {
  const result = await deviceRevokeService({ deviceId: req.params.id }, { userId: req.user.id });
  res.success(deviceRevokeParser(result));
});
