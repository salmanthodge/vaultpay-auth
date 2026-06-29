export const serviceUserGetDocs = {
  '/service/users/{id}': {
    get: {
      tags: ['Service (S2S)'],
      summary: 'Fetch a customer profile (S2S — used by admin-service)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: { description: 'Customer profile' },
        401: { description: 'Caller is not S2S-authenticated' },
        404: { description: 'User not found' },
      },
    },
  },
};
