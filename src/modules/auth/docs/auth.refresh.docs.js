export const refreshDocs = {
  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Rotate a refresh token for a new access + refresh pair',
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
        200: { description: 'New token pair issued' },
        401: { description: 'Refresh token invalid, expired, or reused' },
        422: { description: 'Validation error' },
      },
    },
  },
};
