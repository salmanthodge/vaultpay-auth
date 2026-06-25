import { roleRepository } from '../repositories/role.repository.js';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/index.js';

/**
 * Deletes a role. System roles are protected.
 *
 * @param {{ id: string }} params
 */
export const roleDeleteService = async ({ id }) => {
  const role = await roleRepository.findRoleById(id);
  if (!role) {
    throw new NotFoundError();
  }
  if (role.isSystem) {
    throw new ForbiddenError('System roles cannot be deleted.');
  }
  await roleRepository.deleteRole(id);
  return { deleted: true };
};
