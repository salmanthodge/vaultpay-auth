import { roleRepository } from '../repositories/role.repository.js';

/** Lists the full permission registry. */
export const permissionListService = async () => {
  const permissions = await roleRepository.listPermissions();
  return { permissions };
};
