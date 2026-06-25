export const deviceListDocs = {
  '/auth/devices': {
    get: {
      tags: ['Devices'],
      summary: 'List the authenticated user devices/sessions',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Array of devices' },
        401: { description: 'Missing or invalid access token' },
      },
    },
  },
};
