export const resetPasswordDocs = {
  '/auth/reset-password': {
    post: {
      tags: ['Auth'],
      summary: 'Reset a password using a reset token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token', 'password'],
              properties: {
                token: { type: 'string' },
                password: { type: 'string', minLength: 8, maxLength: 128 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Password reset; existing sessions revoked' },
        400: { description: 'Token invalid or expired' },
        422: { description: 'Validation error' },
      },
    },
  },
};
