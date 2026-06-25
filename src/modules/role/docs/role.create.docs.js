export const roleCreateDocs = {
  '/roles': {
    post: {
      tags: ['Roles'],
      summary: 'Create a role (optionally with permissions)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                permissions: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Role created' },
        409: { description: 'Role name already exists' },
        422: { description: 'Validation error / unknown permission codes' },
      },
    },
  },
};
