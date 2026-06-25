import { Router } from 'express';
import {
  ipTracker,
  rateLimiter,
  serviceAuth,
  validate,
  encryption,
} from '../../../shared/middleware/index.js';
import { serviceTokenConstant, serviceIntrospectConstant } from '../constants/index.js';
import { serviceTokenValidator, serviceIntrospectValidator } from '../validators/index.js';
import { serviceTokenController, serviceIntrospectController } from '../controllers/index.js';

const router = Router();

// ---- public: client-credentials grant ----
router.post(
  serviceTokenConstant.ROUTE,
  ipTracker,
  rateLimiter(serviceTokenConstant.RATE_LIMIT),
  encryption,
  validate(serviceTokenValidator),
  serviceTokenController,
);

// ---- S2S-authenticated: introspection ----
router.post(
  serviceIntrospectConstant.ROUTE,
  ipTracker,
  rateLimiter(serviceIntrospectConstant.RATE_LIMIT),
  serviceAuth,
  encryption,
  validate(serviceIntrospectValidator),
  serviceIntrospectController,
);

export { router as serviceRoutes };
