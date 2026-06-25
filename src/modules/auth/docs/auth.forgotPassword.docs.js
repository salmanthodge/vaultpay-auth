export const forgotPasswordDocs = {
  '/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Request a password-reset email',
      description: 'Always returns 200 to avoid account enumeration.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: { email: { type: 'string', format: 'email' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Reset email sent if the account exists' },
        422: { description: 'Validation error' },
        429: { description: 'Too many requests' },
      },
    },
  },
};
