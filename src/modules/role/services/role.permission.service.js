import { roleRepository } from '../repositories/role.repository.js';
import { AppError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';

/**
 * Internal helper: resolve permission codes -> permission ids, erroring if any
 * code is unknown. Shared by create/update.
 *
 * @param {string[]} codes
 * @returns {Promise<string[]>} permission ids
 */
export const resolvePermissionIds = async (codes) => {
  if (!codes || codes.length === 0) return [];
  const unique = [...new Set(codes)];
  const found = await roleRepository.findPermissionsByCodes(unique);
  if (found.length !== unique.length) {
    const knownCodes = new Set(found.map((p) => p.code));
    const unknown = unique.filter((c) => !knownCodes.has(c));
    throw new AppError(
      `Unknown permission codes: ${unknown.join(', ')}`,
      httpStatus.UNPROCESSABLE_ENTITY,
      errorCodes.VALIDATION_ERROR,
    );
  }
  return found.map((p) => p.id);
};
