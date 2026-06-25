import { v4 as uuidv4 } from 'uuid';
import { authRepository } from '../repositories/auth.repository.js';
import { deviceRepository } from '../../device/repositories/device.repository.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../../shared/utils/jwt.js';
import { sha256 } from '../../../shared/utils/hash.js';
import { roles as roleNames } from '../../../shared/constants/roles.js';

/**
 * Internal service helper (shared by login/refresh): mints an access + refresh
 * token pair, persists the refresh token (hashed) in its rotation family, and
 * returns the raw tokens plus the user's RBAC context for the response.
 *
 * @param {Object} user user row (id, ...)
 * @param {{ ip?: string|null, userAgent?: string|null, familyId?: string }} context
 * @returns {Promise<import('../types/auth.types.js').IssuedTokens>}
 */
export const issueTokens = async (user, context = {}) => {
  const authContext = await authRepository.getUserAuthContext(user.id);
  const accessJti = uuidv4();
  const accessToken = signAccessToken({
    sub: user.id,
    role: authContext.roles[0] ?? roleNames.CUSTOMER,
    roles: authContext.roles,
    permissions: authContext.permissions,
    jti: accessJti,
  });

  const familyId = context.familyId ?? uuidv4();
  const refreshToken = signRefreshToken({ sub: user.id, family: familyId, jti: uuidv4() });
  const decoded = verifyRefreshToken(refreshToken); // freshly signed — read exp for persistence

  // Best-effort device tracking: derive a stable device id and upsert the device
  // row so refresh tokens can be tied to it (enables remote session revocation).
  let userDeviceId = null;
  try {
    const deviceId = sha256(context.userAgent || context.ip || 'unknown');
    const device = await deviceRepository.recordDevice({
      userId: user.id,
      deviceId,
      ip: context.ip ?? null,
      userAgent: context.userAgent ?? null,
      geoCountry: context.geoCountry ?? null,
    });
    userDeviceId = device.id;
  } catch {
    // device tracking must never block authentication
  }

  const record = await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: sha256(refreshToken),
    familyId,
    expiresAt: new Date(decoded.exp * 1000),
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
    userDeviceId,
  });

  return { accessToken, refreshToken, accessJti, refreshId: record.id, authContext };
};
