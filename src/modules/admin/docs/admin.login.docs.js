export const adminLoginDocs = {
  '/admin/auth/login': {
    post: {
      tags: ['Admin'],
      summary: 'Admin login (creates an httpOnly session cookie)',
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
        200: { description: 'Logged in; session cookie set' },
        401: { description: 'Invalid credentials or disabled account' },
        422: { description: 'Validation error' },
        429: { description: 'Too many attempts' },
      },
    },
  },
};
