import { deviceRepository } from '../repositories/device.repository.js';

/**
 * Lists the authenticated user's known devices/sessions.
 *
 * @param {{ userId: string }} input
 */
export const deviceListService = async ({ userId }) => {
  const devices = await deviceRepository.listByUser(userId);
  return { devices };
};
