import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Token signing/verification. Three independent secrets so a leak of one tier
 * (access / refresh / S2S) does not compromise the others (rules/05).
 */
export const signAccessToken = (payload, options = {}) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL, ...options });

export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET);

export const signRefreshToken = (payload, options = {}) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL, ...options });

export const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

export const signServiceToken = (payload, options = {}) =>
  jwt.sign(payload, env.S2S_SECRET, { expiresIn: env.S2S_TOKEN_TTL, ...options });

export const verifyServiceToken = (token) => jwt.verify(token, env.S2S_SECRET);
