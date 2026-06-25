import { mfaRepository } from '../repositories/mfa.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { verifyTotp } from './mfa.totp.service.js';
import { decrypt } from '../../../shared/utils/crypto.js';
import { sha256, safeEqual } from '../../../shared/utils/hash.js';
import { AppError, AuthError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Disables MFA after verifying a current TOTP or backup code; removes the secret
 * and all backup codes.
 *
 * @param {{ code: string }} input
 * @param {{ userId: string, ip?: string, userAgent?: string }} context
 */
export const mfaDisableService = async ({ code }, context) => {
  const mfa = await mfaRepository.findByUserId(context.userId);
  if (!mfa || !mfa.isEnabled) {
    throw new AppError('MFA is not enabled.', httpStatus.BAD_REQUEST, errorCodes.AUTH_MFA_INVALID);
  }

  let verified = verifyTotp(decrypt(mfa.secretEnc), code);
  if (!verified) {
    const hash = sha256(code);
    const active = await mfaRepository.findActiveBackupCodes(context.userId);
    const match = active.find((c) => safeEqual(c.codeHash, hash));
    if (match) {
      await mfaRepository.consumeBackupCode(match.id);
      verified = true;
    }
  }
  if (!verified) {
    throw new AuthError(errorCodes.AUTH_MFA_INVALID);
  }

  await mfaRepository.deleteByUserId(context.userId);
  await mfaRepository.deleteBackupCodes(context.userId);

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: context.userId,
    eventType: events.MFA_DISABLED,
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { disabled: true };
};
