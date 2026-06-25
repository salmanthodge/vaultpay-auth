import { oauthUrlDocs } from './oauth.url.docs.js';
import { oauthCallbackDocs } from './oauth.callback.docs.js';
import { oauthLinkDocs } from './oauth.link.docs.js';
import { oauthUnlinkDocs } from './oauth.unlink.docs.js';

export const oauthDocs = {
  ...oauthUrlDocs,
  ...oauthCallbackDocs,
  ...oauthLinkDocs,
  ...oauthUnlinkDocs,
};
