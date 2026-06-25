import { mfaRepository } from '../repositories/mfa.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { issueTokens } from '../../auth/services/auth.token.service.js';
import { verifyTotp } from './mfa.totp.service.js';
import { redis } from '../../../shared/config/redis.js';
import { decrypt } from '../../../shared/utils/crypto.js';
import { sha256, safeEqual } from '../../../shared/utils/hash.js';
import { AuthError } from '../../../shared/errors/index.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Completes a login MFA challenge: consumes the challenge token, verifies a TOTP
 * code or a one-time backup code, and issues access + refresh tokens.
 *
 * @param {{ mfaToken: string, code: string }} input
 * @param {import('../../auth/types/auth.types.js').RequestContext} context
 */
export const mfaVerifyService = async ({ mfaToken, code }, context = {}) => {
  const userId = await redis.get(`mfa:challenge:${mfaToken}`);
  if (!userId) {
    throw new AuthError(errorCodes.AUTH_MFA_INVALID);
  }

  const mfa = await mfaRepository.findByUserId(userId);
  if (!mfa || !mfa.isEnabled) {
    throw new AuthError(errorCodes.AUTH_MFA_INVALID);
  }

  let verified = verifyTotp(decrypt(mfa.secretEnc), code);
  if (!verified) {
    const hash = sha256(code);
    const active = await mfaRepository.findActiveBackupCodes(userId);
    const match = active.find((c) => safeEqual(c.codeHash, hash));
    if (match) {
      await mfaRepository.consumeBackupCode(match.id);
      verified = true;
    }
  }
  if (!verified) {
    throw new AuthError(errorCodes.AUTH_MFA_INVALID);
  }

  await redis.del(`mfa:challenge:${mfaToken}`);

  const user = await authRepository.findUserById(userId);
  const tokens = await issueTokens(user, { ip: context.ip, userAgent: context.userAgent });
  await authRepository.updateUser(userId, { lastLoginAt: new Date(), failedLoginCount: 0 });
  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: userId,
    eventType: events.USER_LOGGED_IN,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { user, ...tokens };
};
