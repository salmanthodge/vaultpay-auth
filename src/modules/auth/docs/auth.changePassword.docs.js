export const changePasswordDocs = {
  '/auth/change-password': {
    post: {
      tags: ['Auth'],
      summary: 'Change the authenticated user password',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: { type: 'string', minLength: 8 },
                newPassword: { type: 'string', minLength: 8, maxLength: 128 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Password changed; other sessions revoked' },
        401: { description: 'Missing/invalid token or wrong current password' },
        422: { description: 'Validation error' },
      },
    },
  },
};
