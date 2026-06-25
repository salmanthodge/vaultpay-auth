export const logoutDocs = {
  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Log out: revoke the refresh token and deny-list the access token',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: { refreshToken: { type: 'string' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Logged out' },
        401: { description: 'Missing or invalid access token' },
        422: { description: 'Validation error' },
      },
    },
  },
};
