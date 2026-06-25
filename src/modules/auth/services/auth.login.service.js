import { authRepository } from '../repositories/auth.repository.js';
import { issueTokens } from './auth.token.service.js';
import { comparePassword, randomToken } from '../../../shared/utils/hash.js';
import { redis } from '../../../shared/config/redis.js';
import { AuthError } from '../../../shared/errors/index.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';
import { loginConstant } from '../constants/auth.login.constant.js';

const DISABLED_STATUSES = new Set(['SUSPENDED', 'DELETED']);

/**
 * Authenticates a customer. On success returns tokens; if MFA is enabled, returns
 * an MFA challenge (consumed later by the mfa module) instead of tokens.
 *
 * @param {{ email: string, password: string }} input
 * @param {import('../types/auth.types.js').RequestContext} context
 * @returns {Promise<import('../types/auth.types.js').LoginResult>}
 */
export const loginService = async ({ email, password }, context = {}) => {
  const user = await authRepository.findUserByEmail(email);

  // Same error for unknown user / wrong password (no account enumeration).
  if (!user || !user.passwordHash) {
    throw new AuthError(errorCodes.AUTH_INVALID_CREDENTIALS);
  }

  const passwordOk = await comparePassword(password, user.passwordHash);
  if (!passwordOk) {
    await authRepository.incrementFailedLogin(user.id);
    await authRepository.createAuthEvent({
      actorType: actorTypes.CUSTOMER,
      actorId: user.id,
      eventType: events.USER_LOGIN_FAILED,
      ip: context.ip ?? null,
      geoCountry: context.geo?.country ?? null,
      userAgent: context.userAgent ?? null,
    });
    throw new AuthError(errorCodes.AUTH_INVALID_CREDENTIALS);
  }

  if (DISABLED_STATUSES.has(user.status)) {
    throw new AuthError(errorCodes.AUTH_ACCOUNT_DISABLED);
  }

  // MFA gate — if enabled, issue a short-lived challenge instead of tokens.
  const mfa = await authRepository.findMfaByUserId(user.id);
  if (mfa?.isEnabled) {
    const mfaToken = randomToken(32);
    await redis.set(
      `mfa:challenge:${mfaToken}`,
      user.id,
      'EX',
      loginConstant.MFA_CHALLENGE_TTL_SECONDS,
    );
    return { mfaRequired: true, mfaToken };
  }

  const tokens = await issueTokens(user, {
    ip: context.ip,
    userAgent: context.userAgent,
  });

  await authRepository.updateUser(user.id, { lastLoginAt: new Date(), failedLoginCount: 0 });
  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: user.id,
    eventType: events.USER_LOGGED_IN,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { mfaRequired: false, user, ...tokens };
};
