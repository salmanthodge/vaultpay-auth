export const mfaEnableDocs = {
  '/auth/mfa/enable': {
    post: {
      tags: ['MFA'],
      summary: 'Enable MFA by confirming a TOTP code; returns backup codes once',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['code'],
              properties: { code: { type: 'string', pattern: '^\\d{6}$' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'MFA enabled; backup codes returned' },
        401: { description: 'Invalid token or TOTP code' },
        422: { description: 'Validation error' },
      },
    },
  },
};
