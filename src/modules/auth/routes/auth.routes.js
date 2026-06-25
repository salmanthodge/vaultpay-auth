import { Router } from 'express';
import {
  ipTracker,
  rateLimiter,
  auth,
  validate,
  encryption,
} from '../../../shared/middleware/index.js';
import {
  registerConstant,
  loginConstant,
  refreshConstant,
  logoutConstant,
  meConstant,
  verifyEmailConstant,
  forgotPasswordConstant,
  resetPasswordConstant,
  changePasswordConstant,
} from '../constants/index.js';
import {
  registerValidator,
  loginValidator,
  refreshValidator,
  logoutValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from '../validators/index.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  meController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} from '../controllers/index.js';

const router = Router();

/**
 * Pipeline order (rules/03): ipTracker -> rateLimiter -> [auth] -> [rbac] ->
 * encryption(decrypt) -> validate -> controller.
 * Note: decrypt runs BEFORE validate so validation sees the real payload, not
 * the encrypted envelope (clarification flagged to update rule 03's listing).
 */

// ---- public ----
router.post(
  registerConstant.ROUTE,
  ipTracker,
  rateLimiter(registerConstant.RATE_LIMIT),
  encryption,
  validate(registerValidator),
  registerController,
);

router.post(
  loginConstant.ROUTE,
  ipTracker,
  rateLimiter(loginConstant.RATE_LIMIT),
  encryption,
  validate(loginValidator),
  loginController,
);

router.post(
  refreshConstant.ROUTE,
  ipTracker,
  rateLimiter(refreshConstant.RATE_LIMIT),
  encryption,
  validate(refreshValidator),
  refreshController,
);

router.post(
  verifyEmailConstant.ROUTE,
  ipTracker,
  rateLimiter(verifyEmailConstant.RATE_LIMIT),
  encryption,
  validate(verifyEmailValidator),
  verifyEmailController,
);

router.post(
  forgotPasswordConstant.ROUTE,
  ipTracker,
  rateLimiter(forgotPasswordConstant.RATE_LIMIT),
  encryption,
  validate(forgotPasswordValidator),
  forgotPasswordController,
);

router.post(
  resetPasswordConstant.ROUTE,
  ipTracker,
  rateLimiter(resetPasswordConstant.RATE_LIMIT),
  encryption,
  validate(resetPasswordValidator),
  resetPasswordController,
);

// ---- protected (customer access token) ----
router.post(
  changePasswordConstant.ROUTE,
  ipTracker,
  rateLimiter(changePasswordConstant.RATE_LIMIT),
  auth,
  encryption,
  validate(changePasswordValidator),
  changePasswordController,
);

router.post(
  logoutConstant.ROUTE,
  ipTracker,
  rateLimiter(logoutConstant.RATE_LIMIT),
  auth,
  encryption,
  validate(logoutValidator),
  logoutController,
);

router.get(meConstant.ROUTE, ipTracker, rateLimiter(meConstant.RATE_LIMIT), auth, meController);

export { router as authRoutes };
