import { Router } from 'express';
import { ipTracker, rateLimiter, auth, validate, encryption } from '../../../shared/middleware/index.js';
import {
  mfaSetupConstant,
  mfaEnableConstant,
  mfaVerifyConstant,
  mfaDisableConstant,
  mfaBackupCodesConstant,
} from '../constants/index.js';
import {
  mfaEnableValidator,
  mfaVerifyValidator,
  mfaDisableValidator,
  mfaBackupCodesValidator,
} from '../validators/index.js';
import {
  mfaSetupController,
  mfaEnableController,
  mfaVerifyController,
  mfaDisableController,
  mfaBackupCodesController,
} from '../controllers/index.js';

const router = Router();

// ---- public: complete a login MFA challenge ----
router.post(
  mfaVerifyConstant.ROUTE,
  ipTracker,
  rateLimiter(mfaVerifyConstant.RATE_LIMIT),
  encryption,
  validate(mfaVerifyValidator),
  mfaVerifyController,
);

// ---- protected: manage MFA ----
router.post(
  mfaSetupConstant.ROUTE,
  ipTracker,
  rateLimiter(mfaSetupConstant.RATE_LIMIT),
  auth,
  mfaSetupController,
);

router.post(
  mfaEnableConstant.ROUTE,
  ipTracker,
  rateLimiter(mfaEnableConstant.RATE_LIMIT),
  auth,
  encryption,
  validate(mfaEnableValidator),
  mfaEnableController,
);

router.post(
  mfaDisableConstant.ROUTE,
  ipTracker,
  rateLimiter(mfaDisableConstant.RATE_LIMIT),
  auth,
  encryption,
  validate(mfaDisableValidator),
  mfaDisableController,
);

router.post(
  mfaBackupCodesConstant.ROUTE,
  ipTracker,
  rateLimiter(mfaBackupCodesConstant.RATE_LIMIT),
  auth,
  encryption,
  validate(mfaBackupCodesValidator),
  mfaBackupCodesController,
);

export { router as mfaRoutes };
