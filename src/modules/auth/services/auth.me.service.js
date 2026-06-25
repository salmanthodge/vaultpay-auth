import { authRepository } from '../repositories/auth.repository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Returns the authenticated customer's profile plus RBAC context.
 *
 * @param {{ userId: string }} input
 */
export const meService = async ({ userId }) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new NotFoundError();
  }
  const authContext = await authRepository.getUserAuthContext(userId);
  return { user, ...authContext };
};
