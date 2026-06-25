export const serviceTokenDocs = {
  '/service/token': {
    post: {
      tags: ['Service (S2S)'],
      summary: 'Client-credentials grant — issue a short-lived S2S token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['clientId', 'clientSecret'],
              properties: {
                clientId: { type: 'string' },
                clientSecret: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'S2S access token issued' },
        401: { description: 'Invalid or inactive client' },
        422: { description: 'Validation error' },
      },
    },
  },
};
