import { Router } from 'express';
import {
  ipTracker,
  rateLimiter,
  serviceAuth,
  validate,
  encryption,
} from '../../../shared/middleware/index.js';
import {
  serviceTokenConstant,
  serviceIntrospectConstant,
  serviceUserGetConstant,
  serviceUserStatusConstant,
} from '../constants/index.js';
import {
  serviceTokenValidator,
  serviceIntrospectValidator,
  serviceUserGetValidator,
  serviceUserStatusValidator,
} from '../validators/index.js';
import {
  serviceTokenController,
  serviceIntrospectController,
  serviceUserGetController,
  serviceUserStatusController,
} from '../controllers/index.js';

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

// ---- S2S-authenticated: customer lookups/actions (used by admin-service) ----
router.get(
  serviceUserGetConstant.ROUTE,
  ipTracker,
  rateLimiter(serviceUserGetConstant.RATE_LIMIT),
  serviceAuth,
  validate(serviceUserGetValidator),
  serviceUserGetController,
);

router.patch(
  serviceUserStatusConstant.ROUTE,
  ipTracker,
  rateLimiter(serviceUserStatusConstant.RATE_LIMIT),
  serviceAuth,
  encryption,
  validate(serviceUserStatusValidator),
  serviceUserStatusController,
);

export { router as serviceRoutes };
