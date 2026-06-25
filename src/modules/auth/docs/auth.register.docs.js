export const registerDocs = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new customer',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 8, maxLength: 128 },
                fullName: { type: 'string' },
                phone: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Account created (status PENDING); verification email issued' },
        409: { description: 'Email already registered' },
        422: { description: 'Validation error' },
        429: { description: 'Too many requests' },
      },
    },
  },
};
