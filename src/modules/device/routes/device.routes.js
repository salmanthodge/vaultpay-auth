import { Router } from 'express';
import { ipTracker, rateLimiter, auth, validate } from '../../../shared/middleware/index.js';
import { deviceListConstant, deviceRevokeConstant } from '../constants/index.js';
import { deviceRevokeValidator } from '../validators/index.js';
import { deviceListController, deviceRevokeController } from '../controllers/index.js';

const router = Router();

router.get(
  deviceListConstant.ROUTE,
  ipTracker,
  rateLimiter(deviceListConstant.RATE_LIMIT),
  auth,
  deviceListController,
);

router.delete(
  deviceRevokeConstant.ROUTE,
  ipTracker,
  rateLimiter(deviceRevokeConstant.RATE_LIMIT),
  auth,
  validate(deviceRevokeValidator),
  deviceRevokeController,
);

export { router as deviceRoutes };
