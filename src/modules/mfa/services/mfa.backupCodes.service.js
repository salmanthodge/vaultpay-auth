import { mfaRepository } from '../repositories/mfa.repository.js';
import { verifyTotp, generateBackupCodes } from './mfa.totp.service.js';
import { decrypt } from '../../../shared/utils/crypto.js';
import { sha256 } from '../../../shared/utils/hash.js';
import { AppError, AuthError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { mfaConfig } from '../constants/mfa.config.constant.js';

/**
 * Regenerates one-time backup codes (invalidating the old set) after verifying a
 * current TOTP code. New codes are returned once.
 *
 * @param {{ code: string }} input
 * @param {{ userId: string }} context
 */
export const mfaBackupCodesService = async ({ code }, context) => {
  const mfa = await mfaRepository.findByUserId(context.userId);
  if (!mfa || !mfa.isEnabled) {
    throw new AppError('MFA is not enabled.', httpStatus.BAD_REQUEST, errorCodes.AUTH_MFA_INVALID);
  }

  if (!verifyTotp(decrypt(mfa.secretEnc), code)) {
    throw new AuthError(errorCodes.AUTH_MFA_INVALID);
  }

  const backupCodes = generateBackupCodes(mfaConfig.BACKUP_CODE_COUNT, mfaConfig.BACKUP_CODE_BYTES);
  await mfaRepository.replaceBackupCodes(context.userId, backupCodes.map(sha256));

  return { backupCodes };
};
