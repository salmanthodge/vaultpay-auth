import { Router } from 'express';
import {
  ipTracker,
  rateLimiter,
  adminSession,
  validate,
  encryption,
} from '../../../shared/middleware/index.js';
import { adminLoginConstant, adminLogoutConstant, adminSessionConstant } from '../constants/index.js';
import { adminLoginValidator } from '../validators/index.js';
import {
  adminLoginController,
  adminLogoutController,
  adminSessionController,
} from '../controllers/index.js';

const router = Router();

// ---- public ----
router.post(
  adminLoginConstant.ROUTE,
  ipTracker,
  rateLimiter(adminLoginConstant.RATE_LIMIT),
  encryption,
  validate(adminLoginValidator),
  adminLoginController,
);

// ---- session-protected ----
router.post(
  adminLogoutConstant.ROUTE,
  ipTracker,
  rateLimiter(adminLogoutConstant.RATE_LIMIT),
  adminSession,
  adminLogoutController,
);

router.get(
  adminSessionConstant.ROUTE,
  ipTracker,
  rateLimiter(adminSessionConstant.RATE_LIMIT),
  adminSession,
  adminSessionController,
);

export { router as adminRoutes };
