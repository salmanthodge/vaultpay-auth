export const rolePermissionsDocs = {
  '/permissions': {
    get: {
      tags: ['Roles'],
      summary: 'List the permission registry',
      security: [{ cookieAuth: [] }],
      responses: {
        200: { description: 'Array of permissions' },
        401: { description: 'No valid admin session' },
        403: { description: 'Insufficient admin role' },
      },
    },
  },
};
