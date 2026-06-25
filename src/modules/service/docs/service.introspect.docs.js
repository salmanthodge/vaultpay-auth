export const serviceIntrospectDocs = {
  '/service/introspect': {
    post: {
      tags: ['Service (S2S)'],
      summary: 'Introspect an S2S token (requires a valid S2S token to call)',
      security: [{ bearerAuth: [] }],
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
        200: { description: 'Introspection result ({ active, clientId, scopes, exp })' },
        401: { description: 'Caller is not S2S-authenticated' },
        422: { description: 'Validation error' },
      },
    },
  },
};
