import { roleRepository } from '../repositories/role.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Assigns a role to a user. Validates both exist first.
 *
 * @param {{ userId: string }} params
 * @param {{ roleId: string }} input
 */
export const roleAssignUserService = async ({ userId }, { roleId }) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  const role = await roleRepository.findRoleById(roleId);
  if (!role) {
    throw new NotFoundError('Role not found.');
  }

  await roleRepository.assignRoleToUser(userId, roleId);
  return { assigned: true, userId, role: { id: role.id, name: role.name } };
};
