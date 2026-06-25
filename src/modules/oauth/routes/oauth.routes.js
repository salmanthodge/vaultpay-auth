import { Router } from 'express';
import { ipTracker, rateLimiter, auth, validate } from '../../../shared/middleware/index.js';
import {
  oauthUrlConstant,
  oauthCallbackConstant,
  oauthLinkConstant,
  oauthUnlinkConstant,
} from '../constants/index.js';
import {
  oauthUrlValidator,
  oauthCallbackValidator,
  oauthLinkValidator,
  oauthUnlinkValidator,
} from '../validators/index.js';
import {
  oauthUrlController,
  oauthCallbackController,
  oauthLinkController,
  oauthUnlinkController,
} from '../controllers/index.js';

const router = Router();

// ---- public (begin sign-in + provider redirect) ----
router.get(
  oauthUrlConstant.ROUTE,
  ipTracker,
  rateLimiter(oauthUrlConstant.RATE_LIMIT),
  validate(oauthUrlValidator),
  oauthUrlController,
);

router.get(
  oauthCallbackConstant.ROUTE,
  ipTracker,
  rateLimiter(oauthCallbackConstant.RATE_LIMIT),
  validate(oauthCallbackValidator),
  oauthCallbackController,
);

// ---- protected (manage links) ----
router.post(
  oauthLinkConstant.ROUTE,
  ipTracker,
  rateLimiter(oauthLinkConstant.RATE_LIMIT),
  auth,
  validate(oauthLinkValidator),
  oauthLinkController,
);

router.delete(
  oauthUnlinkConstant.ROUTE,
  ipTracker,
  rateLimiter(oauthUnlinkConstant.RATE_LIMIT),
  auth,
  validate(oauthUnlinkValidator),
  oauthUnlinkController,
);

export { router as oauthRoutes };
