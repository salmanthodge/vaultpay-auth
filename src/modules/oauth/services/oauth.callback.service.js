import { redis } from '../../../shared/config/redis.js';
import { oauthRepository } from '../repositories/oauth.repository.js';
import { authRepository } from '../../auth/repositories/auth.repository.js';
import { issueTokens } from '../../auth/services/auth.token.service.js';
import { exchangeCode, fetchProfile, isProviderConfigured } from './oauth.client.service.js';
import { AppError } from '../../../shared/errors/index.js';
import { httpStatus } from '../../../shared/constants/httpStatus.js';
import { errorCodes } from '../../../shared/constants/errorCodes.js';
import { roles as roleNames, actorTypes } from '../../../shared/constants/roles.js';
import { events } from '../../../shared/constants/events.js';

/**
 * Resolves a VaultPay user from a provider profile. Pure DB logic (no network),
 * exported so it can be exercised independently.
 *
 * @param {{ provider: string, profile: { providerUserId: string, email: string|null, name: string|null }, linkUserId?: string|null }} input
 * @returns {Promise<{ user: Object, linked: boolean }>}
 */
export const upsertUserFromProfile = async ({ provider, profile, linkUserId = null }) => {
  // ---- link flow: attach this provider identity to an existing user ----
  if (linkUserId) {
    const existing = await oauthRepository.findByProviderUser(provider, profile.providerUserId);
    if (existing && existing.userId !== linkUserId) {
      throw new AppError(
        'This provider account is already linked to another user.',
        httpStatus.CONFLICT,
        errorCodes.CONFLICT,
      );
    }
    if (!existing) {
      await oauthRepository.createAccount({
        userId: linkUserId,
        provider,
        providerUserId: profile.providerUserId,
        email: profile.email,
      });
    }
    const user = await authRepository.findUserById(linkUserId);
    return { user, linked: true };
  }

  // ---- login/signup flow ----
  const account = await oauthRepository.findByProviderUser(provider, profile.providerUserId);
  if (account) {
    const user = await authRepository.findUserById(account.userId);
    return { user, linked: false };
  }

  let user = profile.email ? await authRepository.findUserByEmail(profile.email) : null;
  if (!user) {
    user = await authRepository.createUser({
      email: profile.email ?? `${provider.toLowerCase()}_${profile.providerUserId}@oauth.local`,
      passwordHash: null,
      fullName: profile.name ?? null,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    });
    const customerRole = await authRepository.findRoleByName(roleNames.CUSTOMER);
    if (customerRole) await authRepository.assignRole(user.id, customerRole.id);
  }

  await oauthRepository.createAccount({
    userId: user.id,
    provider,
    providerUserId: profile.providerUserId,
    email: profile.email,
  });
  return { user, linked: false };
};

/**
 * Completes the OAuth redirect: validates state, exchanges the code, fetches the
 * profile, resolves the user, and (login flow) issues tokens.
 *
 * @param {{ provider: string, code: string, state: string }} input
 * @param {import('../../auth/types/auth.types.js').RequestContext} context
 */
export const oauthCallbackService = async ({ provider, code, state }, context = {}) => {
  const raw = await redis.get(`oauth:state:${state}`);
  if (!raw) {
    throw new AppError('OAuth state is invalid or has expired.', httpStatus.BAD_REQUEST, errorCodes.OAUTH_STATE_INVALID);
  }
  const parsed = JSON.parse(raw);
  if (parsed.provider !== provider) {
    throw new AppError('OAuth state is invalid or has expired.', httpStatus.BAD_REQUEST, errorCodes.OAUTH_STATE_INVALID);
  }
  await redis.del(`oauth:state:${state}`);

  if (!isProviderConfigured(provider)) {
    throw new AppError('OAuth provider is not configured.', httpStatus.BAD_REQUEST, errorCodes.OAUTH_PROVIDER_UNSUPPORTED);
  }

  let profile;
  try {
    const accessToken = await exchangeCode(provider, code);
    profile = await fetchProfile(provider, accessToken);
  } catch {
    throw new AppError('Failed to complete OAuth sign-in.', httpStatus.BAD_REQUEST, errorCodes.OAUTH_EXCHANGE_FAILED);
  }

  const { user, linked } = await upsertUserFromProfile({
    provider,
    profile,
    linkUserId: parsed.linkUserId,
  });

  if (parsed.linkUserId) {
    await authRepository.createAuthEvent({
      actorType: actorTypes.CUSTOMER,
      actorId: user.id,
      eventType: events.OAUTH_LINKED,
      ip: context.ip ?? null,
      geoCountry: context.geo?.country ?? null,
      userAgent: context.userAgent ?? null,
    });
    return { linked, user };
  }

  const tokens = await issueTokens(user, { ip: context.ip, userAgent: context.userAgent });
  await authRepository.updateUser(user.id, { lastLoginAt: new Date() });
  await authRepository.createAuthEvent({
    actorType: actorTypes.CUSTOMER,
    actorId: user.id,
    eventType: events.USER_LOGGED_IN,
    ip: context.ip ?? null,
    geoCountry: context.geo?.country ?? null,
    userAgent: context.userAgent ?? null,
  });

  return { linked, user, ...tokens };
};
