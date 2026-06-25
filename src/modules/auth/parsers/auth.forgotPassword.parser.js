/** Uniform response regardless of whether the email exists (no enumeration). */
export const forgotPasswordParser = () => ({
  message: 'If an account exists for that email, a reset link has been sent.',
});
