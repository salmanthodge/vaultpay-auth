/** Shapes the device revoke result. */
export const deviceRevokeParser = (result) => ({ revoked: Boolean(result.revoked) });
