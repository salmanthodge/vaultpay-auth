import { Router } from 'express';
import {
  ipTracker,
  rateLimiter,
  adminSession,
  adminRole,
  validate,
  encryption,
} from '../../../shared/middleware/index.js';
import { adminRoles } from '../../../shared/constants/roles.js';
import {
  roleListConstant,
  roleCreateConstant,
  roleUpdateConstant,
  roleDeleteConstant,
  rolePermissionsConstant,
  roleAssignUserConstant,
} from '../constants/index.js';
import {
  roleListValidator,
  roleCreateValidator,
  roleUpdateValidator,
  roleDeleteValidator,
  roleAssignUserValidator,
} from '../validators/index.js';
import {
  roleListController,
  roleCreateController,
  roleUpdateController,
  roleDeleteController,
  permissionListController,
  roleAssignUserController,
} from '../controllers/index.js';

const router = Router();

// All RBAC management requires an admin session + admin role (SUPER_ADMIN bypasses).
const guard = [adminSession, adminRole(adminRoles.ADMIN)];

router.get(
  roleListConstant.ROUTE,
  ipTracker,
  rateLimiter(roleListConstant.RATE_LIMIT),
  ...guard,
  validate(roleListValidator),
  roleListController,
);

router.post(
  roleCreateConstant.ROUTE,
  ipTracker,
  rateLimiter(roleCreateConstant.RATE_LIMIT),
  ...guard,
  encryption,
  validate(roleCreateValidator),
  roleCreateController,
);

router.patch(
  roleUpdateConstant.ROUTE,
  ipTracker,
  rateLimiter(roleUpdateConstant.RATE_LIMIT),
  ...guard,
  encryption,
  validate(roleUpdateValidator),
  roleUpdateController,
);

router.delete(
  roleDeleteConstant.ROUTE,
  ipTracker,
  rateLimiter(roleDeleteConstant.RATE_LIMIT),
  ...guard,
  validate(roleDeleteValidator),
  roleDeleteController,
);

router.get(
  rolePermissionsConstant.ROUTE,
  ipTracker,
  rateLimiter(rolePermissionsConstant.RATE_LIMIT),
  ...guard,
  permissionListController,
);

router.post(
  roleAssignUserConstant.ROUTE,
  ipTracker,
  rateLimiter(roleAssignUserConstant.RATE_LIMIT),
  ...guard,
  encryption,
  validate(roleAssignUserValidator),
  roleAssignUserController,
);

export { router as roleRoutes };
