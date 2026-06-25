import { oauthRepository } from '../repositories/oauth.repository.js';

/**
 * Unlinks a provider from the authenticated user.
 *
 * @param {{ provider: string }} input
 * @param {{ userId: string }} context
 */
export const oauthUnlinkService = async ({ provider }, context) => {
  const result = await oauthRepository.deleteByUserAndProvider(context.userId, provider);
  return { unlinked: result.count > 0 };
};
