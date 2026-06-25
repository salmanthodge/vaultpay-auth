import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

/** Password hashing (bcrypt) — never store plaintext (rules/05). */
export const hashPassword = (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

/**
 * Fast one-way hash for opaque tokens we persist (refresh, email-verify, reset,
 * backup codes). We store the hash, never the raw token.
 */
export const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

/** Cryptographically-random opaque token (hex). */
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

/** Constant-time comparison of two hex/utf8 strings of equal length. */
export const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};
