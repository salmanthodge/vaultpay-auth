export const serviceTokenParser = (result) => ({
  accessToken: result.accessToken,
  tokenType: result.tokenType,
  expiresIn: result.expiresIn,
  scopes: result.scopes,
});
