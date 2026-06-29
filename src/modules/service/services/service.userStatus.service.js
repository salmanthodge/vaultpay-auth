import { authRepository } from '../../auth/repositories/auth.repository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * S2S: set a customer's status (ACTIVE/SUSPENDED). Consumed by admin-service for
 * back-office suspend/reactivate actions.
 *
 * @param {{ id: string }} params
 * @param {{ status: 'ACTIVE'|'SUSPENDED' }} input
 */
export const serviceUserStatusService = async ({ id }, { status }) => {
  const existing = await authRepository.findUserById(id);
  if (!existing) {
    throw new NotFoundError();
  }
  const user = await authRepository.updateUser(id, { status });
  return { user };
};
