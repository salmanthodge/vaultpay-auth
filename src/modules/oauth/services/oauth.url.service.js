import { redis } from '../../../shared/config/redis.js';
import { randomToken } from '../../../shared/utils/hash.js';
import { buildAuthorizeUrl } from './oauth.client.service.js';
import { oauthProviders } from '../constants/oauth.providers.constant.js';

/**
 * Builds the provider authorize URL and stores an anti-CSRF `state` in Redis.
 * When `linkUserId` is provided (link flow), the callback links instead of
 * logging in.
 *
 * @param {{ provider: string }} input
 * @param {{ linkUserId?: string|null }} context
 */
export const oauthUrlService = async ({ provider }, context = {}) => {
  const state = randomToken(24);
  await redis.set(
    `oauth:state:${state}`,
    JSON.stringify({ provider, linkUserId: context.linkUserId ?? null }),
    'EX',
    oauthProviders.STATE_TTL_SECONDS,
  );
  const url = buildAuthorizeUrl(provider, state);
  return { provider, url, state };
};
