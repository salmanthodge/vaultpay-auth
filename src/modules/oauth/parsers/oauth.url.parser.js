/** Shapes the authorize-URL response. */
export const oauthUrlParser = (result) => ({
  provider: result.provider,
  url: result.url,
  state: result.state,
});
