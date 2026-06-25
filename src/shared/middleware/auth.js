import { verifyAccessToken } from '../utils/jwt.js';
import { redis } from '../config/redis.js';
import { AuthError } from '../errors/index.js';
import { errorCodes } from '../constants/errorCodes.js';

/**
 * Customer JWT authentication (rules/05). Verifies the Bearer access token,
 * checks the Redis deny-list (logout/rotation), and attaches req.user.
 * Stateless: every request carries its own token.
 */
export const auth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AuthError(errorCodes.AUTH_TOKEN_MISSING);
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new AuthError(
        err.name === 'TokenExpiredError'
          ? errorCodes.AUTH_TOKEN_EXPIRED
          : errorCodes.AUTH_TOKEN_INVALID,
      );
    }

    if (payload.jti && (await redis.get(`denylist:access:${payload.jti}`))) {
      throw new AuthError(errorCodes.AUTH_TOKEN_INVALID);
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
      jti: payload.jti,
      exp: payload.exp,
    };

    return next();
  } catch (err) {
    return next(err);
  }
};
