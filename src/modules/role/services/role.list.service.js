import { roleRepository } from '../repositories/role.repository.js';
import { getPagination, buildPageMeta } from '../../../shared/utils/pagination.js';

/**
 * Lists roles (paginated) with their permissions.
 *
 * @param {{ page?: number, limit?: number }} query
 */
export const roleListService = async (query = {}) => {
  const { skip, take, page, limit } = getPagination(query);
  const [roles, total] = await Promise.all([
    roleRepository.listRoles({ skip, take }),
    roleRepository.countRoles(),
  ]);
  return { roles, meta: buildPageMeta({ page, limit, total }) };
};
