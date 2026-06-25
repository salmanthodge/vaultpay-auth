import QRCode from 'qrcode';
import { mfaRepository } from '../repositories/mfa.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { generateSecret, buildOtpauthUrl } from './mfa.totp.service.js';
import { encrypt } from '../../../shared/utils/crypto.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Begins MFA enrollment: generates a TOTP secret (stored encrypted, not yet
 * enabled) and returns the otpauth URL + a QR data URL for authenticator apps.
 *
 * @param {{ userId: string }} context
 */
export const mfaSetupService = async (_input, context) => {
  const user = await authRepository.findUserById(context.userId);
  if (!user) throw new NotFoundError();

  const secret = generateSecret();
  const otpauthUrl = buildOtpauthUrl(secret, user.email);

  await mfaRepository.upsert(user.id, {
    secretEnc: encrypt(secret),
    isEnabled: false,
    enabledAt: null,
  });

  const qr = await QRCode.toDataURL(otpauthUrl);
  return { secret, otpauthUrl, qr };
};
