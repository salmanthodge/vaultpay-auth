/** Shapes the MFA enrollment response (shown once during setup). */
export const mfaSetupParser = (result) => ({
  secret: result.secret,
  otpauthUrl: result.otpauthUrl,
  qr: result.qr,
});
