/** Shapes the link-initiation response (authorize URL bound to the user). */
export const oauthLinkParser = (result) => ({
  provider: result.provider,
  url: result.url,
  state: result.state,
});
