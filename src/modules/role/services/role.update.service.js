import { roleRepository } from '../repositories/role.repository.js';
import { resolvePermissionIds } from './role.permission.service.js';
import { AppError, NotFoundError, ForbiddenError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';

/**
 * Updates a role's description and/or permission set. System roles cannot be
 * renamed.
 *
 * @param {{ id: string }} params
 * @param {{ name?: string, description?: string, permissions?: string[] }} input
 */
export const roleUpdateService = async ({ id }, { name, description, permissions }) => {
  const role = await roleRepository.findRoleById(id);
  if (!role) {
    throw new NotFoundError();
  }

  if (name && name !== role.name) {
    if (role.isSystem) {
      throw new ForbiddenError('System roles cannot be renamed.');
    }
    const clash = await roleRepository.findRoleByName(name);
    if (clash) {
      throw new AppError('A role with this name already exists.', httpStatus.CONFLICT, errorCodes.CONFLICT);
    }
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (Object.keys(data).length) {
    await roleRepository.updateRole(id, data);
  }

  if (permissions !== undefined) {
    const permissionIds = await resolvePermissionIds(permissions);
    await roleRepository.setRolePermissions(id, permissionIds);
  }

  return { role: await roleRepository.findRoleById(id) };
};
