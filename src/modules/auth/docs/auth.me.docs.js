export const meDocs = {
  '/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get the authenticated customer profile and RBAC context',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Current user profile, roles and permissions' },
        401: { description: 'Missing or invalid access token' },
        404: { description: 'User not found' },
      },
    },
  },
};
