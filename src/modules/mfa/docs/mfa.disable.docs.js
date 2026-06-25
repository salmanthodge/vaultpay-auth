export const mfaDisableDocs = {
  '/auth/mfa/disable': {
    post: {
      tags: ['MFA'],
      summary: 'Disable MFA after verifying a current TOTP or backup code',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code'],
              properties: { code: { type: 'string' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'MFA disabled' },
        401: { description: 'Invalid token or code' },
        422: { description: 'Validation error' },
      },
    },
  },
};
