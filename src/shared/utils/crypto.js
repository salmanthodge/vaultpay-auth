import crypto from 'node:crypto';
import { env } from '../config/env.js';

/**
 * AES-256-GCM symmetric encryption used by:
 *  - the encryption middleware (request/response payload encryption toggle)
 *  - at-rest encryption of sensitive columns (e.g. TOTP secret, OAuth tokens)
 *
 * Key is derived by SHA-256 of ENCRYPTION_KEY so any sufficiently long secret works.
 * Output format (base64): [12-byte IV][16-byte auth tag][ciphertext].
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY = crypto.createHash('sha256').update(env.ENCRYPTION_KEY).digest();

export const encrypt = (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
};

export const decrypt = (payload) => {
  const buffer = Buffer.from(payload, 'base64');
  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};
