import { env } from '../config/env.js';
import { decrypt } from '../utils/crypto.js';
import { AppError } from '../errors/index.js';
import { httpStatus } from '../constants/httpStatus.js';
import { errorCodes } from '../constants/errorCodes.js';

/**
 * Inbound decryption. Pass-through unless ENCRYPTION_ENABLED (rules/05). When a
 * request arrives as `{ "encrypted": "<base64>" }`, decrypt it back into req.body
 * before validation. Plain bodies are still allowed (clients may opt in per-call).
 */
export const encryption = (req, _res, next) => {
  if (!env.ENCRYPTION_ENABLED) return next();

  const encrypted = req.body?.encrypted;
  if (!encrypted) return next();

  try {
    req.body = JSON.parse(decrypt(encrypted));
    return next();
  } catch {
    return next(
      new AppError(
        'Failed to decrypt request payload',
        httpStatus.BAD_REQUEST,
        errorCodes.ENCRYPTION_ERROR,
      ),
    );
  }
};
