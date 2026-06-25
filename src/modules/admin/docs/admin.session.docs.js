export const adminSessionDocs = {
  '/admin/auth/session': {
    get: {
      tags: ['Admin'],
      summary: 'Get the current admin session profile',
      security: [{ cookieAuth: [] }],
      responses: {
        200: { description: 'Current admin profile' },
        401: { description: 'No valid session' },
      },
    },
  },
};
