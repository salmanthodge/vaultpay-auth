export const serviceUserStatusDocs = {
  '/service/users/{id}/status': {
    patch: {
      tags: ['Service (S2S)'],
      summary: 'Set a customer status ACTIVE/SUSPENDED (S2S — used by admin-service)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: { status: { type: 'string', enum: ['ACTIVE', 'SUSPENDED'] } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Updated customer profile' },
        401: { description: 'Caller is not S2S-authenticated' },
        404: { description: 'User not found' },
        422: { description: 'Validation error' },
      },
    },
  },
};
