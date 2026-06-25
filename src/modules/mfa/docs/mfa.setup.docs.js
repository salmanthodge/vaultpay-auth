export const mfaSetupDocs = {
  '/auth/mfa/setup': {
    post: {
      tags: ['MFA'],
      summary: 'Begin TOTP enrollment (returns secret + QR; not yet enabled)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'otpauth URL, secret and QR data URL' },
        401: { description: 'Missing or invalid access token' },
      },
    },
  },
};
