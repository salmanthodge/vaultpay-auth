export const verifyEmailDocs = {
  '/auth/verify-email': {
    post: {
      tags: ['Auth'],
      summary: 'Verify an email address with a token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token'],
              properties: { token: { type: 'string' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Email verified; account activated' },
        400: { description: 'Token invalid or expired' },
        422: { description: 'Validation error' },
      },
    },
  },
};
