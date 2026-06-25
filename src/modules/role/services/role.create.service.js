import { roleRepository } from '../repositories/role.repository.js';
import { resolvePermissionIds } from './role.permission.service.js';
import { AppError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';

/**
 * Creates a role and optionally assigns permissions (by code).
 *
 * @param {{ name: string, description?: string, permissions?: string[] }} input
 */
export const roleCreateService = async ({ name, description, permissions }) => {
  const existing = await roleRepository.findRoleByName(name);
  if (existing) {
    throw new AppError('A role with this name already exists.', httpStatus.CONFLICT, errorCodes.CONFLICT);
  }

  const permissionIds = await resolvePermissionIds(permissions);
  const role = await roleRepository.createRole({ name, description: description ?? null });
  if (permissionIds.length) {
    await roleRepository.setRolePermissions(role.id, permissionIds);
  }

  return { role: await roleRepository.findRoleById(role.id) };
};
