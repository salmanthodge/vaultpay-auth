/** Shapes the rotated token pair. */
export const refreshParser = (result) => ({
  tokens: {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  },
});
