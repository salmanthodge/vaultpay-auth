import { authRepository } from '../../auth/repositories/auth.repository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * S2S: fetch a customer's profile by id (consumed by admin-service).
 *
 * @param {{ id: string }} params
 */
export const serviceUserGetService = async ({ id }) => {
  const user = await authRepository.findUserById(id);
  if (!user) {
    throw new NotFoundError();
  }
  return { user };
};
