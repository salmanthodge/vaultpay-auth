/** Shapes the enable response; backup codes are returned once. */
export const mfaEnableParser = (result) => ({
  enabled: result.enabled,
  backupCodes: result.backupCodes,
});
