import { env, isProduction } from '../../../shared/config/env.js';

/** Shared cookie options for the admin session cookie. */
export const adminCookie = {
  NAME: env.SESSION_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: env.SESSION_TTL_SECONDS * 1000,
  },
  clearOptions: { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' },
};
