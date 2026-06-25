import { verifyServiceToken } from '../../../shared/utils/jwt.js';

/**
 * Token introspection (RFC 7662 style): returns active=false for any invalid or
 * expired token rather than erroring.
 *
 * @param {{ token: string }} input
 */
export const serviceIntrospectService = async ({ token }) => {
  try {
    const claims = verifyServiceToken(token);
    return {
      active: true,
      clientId: claims.sub,
      scopes: claims.scopes ?? [],
      type: claims.type ?? null,
      exp: claims.exp,
    };
  } catch {
    return { active: false };
  }
};
