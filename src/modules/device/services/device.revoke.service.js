import { deviceRepository } from '../repositories/device.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Revokes a device (remote sign-out): marks it revoked and revokes every refresh
 * token tied to it. Only the owning user may revoke their device.
 *
 * @param {{ deviceId: string }} input  device row id (path param)
 * @param {{ userId: string }} context
 */
export const deviceRevokeService = async ({ deviceId }, context) => {
  const device = await deviceRepository.findById(deviceId);
  if (!device || device.userId !== context.userId) {
    throw new NotFoundError();
  }

  await deviceRepository.revokeById(device.id);
  await authRepository.revokeRefreshTokensByDevice(device.id);

  return { revoked: true };
};
