export const mfaVerifyDocs = {
  '/auth/mfa/verify': {
    post: {
      tags: ['MFA'],
      summary: 'Complete a login MFA challenge (TOTP or backup code) and get tokens',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['mfaToken', 'code'],
              properties: {
                mfaToken: { type: 'string', description: 'From the login mfaRequired response' },
                code: { type: 'string', description: 'TOTP (6 digits) or a backup code' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Tokens issued' },
        401: { description: 'Challenge expired or invalid code' },
        422: { description: 'Validation error' },
      },
    },
  },
};
