export const mfaBackupCodesDocs = {
  '/auth/mfa/backup-codes': {
    post: {
      tags: ['MFA'],
      summary: 'Regenerate backup codes (invalidates the old set)',
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
        200: { description: 'New backup codes returned' },
        401: { description: 'Invalid token or TOTP code' },
        422: { description: 'Validation error' },
      },
    },
  },
};
