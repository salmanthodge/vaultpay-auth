export const roleDeleteDocs = {
  '/roles/{id}': {
    delete: {
      tags: ['Roles'],
      summary: 'Delete a role (system roles are protected)',
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: { description: 'Role deleted' },
        403: { description: 'System role cannot be deleted' },
        404: { description: 'Role not found' },
      },
    },
  },
};
