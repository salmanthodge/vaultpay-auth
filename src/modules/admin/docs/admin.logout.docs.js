export const adminLogoutDocs = {
  '/admin/auth/logout': {
    post: {
      tags: ['Admin'],
      summary: 'Admin logout (destroys the session)',
      security: [{ cookieAuth: [] }],
      responses: {
        200: { description: 'Logged out; cookie cleared' },
        401: { description: 'No valid session' },
      },
    },
  },
};
