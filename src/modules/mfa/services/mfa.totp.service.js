import { authenticator } from 'otplib';
import { env } from '../../../shared/config/env.js';
import { randomToken } from '../../../shared/utils/hash.js';

/** Pure TOTP helpers (no DB) — used by the MFA services. */
export const generateSecret = () => authenticator.generateSecret();

export const buildOtpauthUrl = (secret, accountName) =>
  authenticator.keyuri(accountName, env.MFA_ISSUER, secret);

export const verifyTotp = (secret, token) => {
  try {
    return authenticator.verify({ token: String(token), secret });
  } catch {
    return false;
  }
};

export const generateBackupCodes = (count, bytes) =>
  Array.from({ length: count }, () => randomToken(bytes));
