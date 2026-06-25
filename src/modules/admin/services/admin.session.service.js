import { adminRepository } from '../repositories/admin.repository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Returns the current admin's profile for an active session.
 *
 * @param {{ adminId: string }} input
 */
export const adminSessionService = async ({ adminId }) => {
  const admin = await adminRepository.findById(adminId);
  if (!admin) {
    throw new NotFoundError();
  }
  return { admin };
};
