import { mfaRepository } from '../repositories/mfa.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { verifyTotp, generateBackupCodes } from './mfa.totp.service.js';
import { decrypt } from '../../../shared/utils/crypto.js';
import { sha256 } from '../../../shared/utils/hash.js';
import { AppError, AuthError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';
import { mfaConfig } from '../constants/mfa.config.constant.js';

/**
 * Enables MFA after verifying a TOTP code from the enrolled secret, then issues
 * one-time backup codes (returned once; only hashes are stored).
 *
 * @param {{ code: string }} input
 * @param {{ userId: string, ip?: string, userAgent?: string }} context
 */
export const mfaEnableService = async ({ code }, context) => {
  const mfa = await mfaRepository.findByUserId(context.userId);
  if (!mfa) {
    throw new AppError('MFA is not set up. Call setup first.', httpStatus.BAD_REQUEST, errorCodes.AUTH_MFA_INVALID);
  }

  const secret = decrypt(mfa.secretEnc);
  if (!verifyTotp(secret, code)) {
    throw new AuthError(errorCodes.AUTH_MFA_INVALID);
  }

  await mfaRepository.update(context.userId, { isEnabled: true, enabledAt: new Date() });

  const backupCodes = generateBackupCodes(mfaConfig.BACKUP_CODE_COUNT, mfaConfig.BACKUP_CODE_BYTES);
  await mfaRepository.replaceBackupCodes(context.userId, backupCodes.map(sha256));

  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: context.userId,
    eventType: events.MFA_ENABLED,
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { enabled: true, backupCodes };
};
