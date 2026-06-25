export const roleListDocs = {
  '/roles': {
    get: {
      tags: ['Roles'],
      summary: 'List roles (paginated)',
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: { description: 'Array of roles with permissions + pagination meta' },
        401: { description: 'No valid admin session' },
        403: { description: 'Insufficient admin role' },
      },
    },
  },
};
