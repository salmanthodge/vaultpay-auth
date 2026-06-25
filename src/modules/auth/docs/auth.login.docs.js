export const loginDocs = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Authenticate a customer and issue tokens',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Tokens issued, or an MFA challenge when MFA is enabled (mfaRequired=true)',
        },
        401: { description: 'Invalid credentials or disabled account' },
        422: { description: 'Validation error' },
        429: { description: 'Too many attempts' },
      },
    },
  },
};
