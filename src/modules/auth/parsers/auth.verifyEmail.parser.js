/** Shapes the email-verification result. */
export const verifyEmailParser = (result) => ({
  verified: true,
  status: result.user.status,
});
