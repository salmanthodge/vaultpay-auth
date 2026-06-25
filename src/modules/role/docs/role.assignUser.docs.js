export const roleAssignUserDocs = {
  '/users/{userId}/roles': {
    post: {
      tags: ['Roles'],
      summary: 'Assign a role to a user',
      security: [{ cookieAuth: [] }],
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['roleId'],
              properties: { roleId: { type: 'string', format: 'uuid' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Role assigned' },
        404: { description: 'User or role not found' },
        422: { description: 'Validation error' },
      },
    },
  },
};
