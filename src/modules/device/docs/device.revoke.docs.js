export const deviceRevokeDocs = {
  '/auth/devices/{id}': {
    delete: {
      tags: ['Devices'],
      summary: 'Revoke a device (remote sign-out) and its sessions',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: { description: 'Device revoked; associated refresh tokens invalidated' },
        401: { description: 'Missing or invalid access token' },
        404: { description: 'Device not found' },
      },
    },
  },
};
