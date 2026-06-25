import { oauthUrlService } from './oauth.url.service.js';

/**
 * Initiates linking a provider to the authenticated user: same as the url flow
 * but binds the state to the current user so the callback links rather than logs in.
 *
 * @param {{ provider: string }} input
 * @param {{ userId: string }} context
 */
export const oauthLinkService = ({ provider }, context) =>
  oauthUrlService({ provider }, { linkUserId: context.userId });
