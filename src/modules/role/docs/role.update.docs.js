export const roleUpdateDocs = {
  '/roles/{id}': {
    patch: {
      tags: ['Roles'],
      summary: 'Update a role description and/or permissions',
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
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
        200: { description: 'Role updated' },
        403: { description: 'System role cannot be renamed' },
        404: { description: 'Role not found' },
        409: { description: 'Role name already exists' },
      },
    },
  },
};
