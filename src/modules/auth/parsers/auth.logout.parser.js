/** Shapes the logout result. */
export const logoutParser = (result) => ({
  loggedOut: Boolean(result?.loggedOut ?? true),
});
