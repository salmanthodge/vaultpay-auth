export const oauthUnlinkDocs = {
  '/auth/oauth/{provider}': {
    delete: {
      tags: ['OAuth'],
      summary: 'Unlink a provider from the authenticated account',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'provider', in: 'path', required: true, schema: { type: 'string', enum: ['google', 'github'] } },
      ],
      responses: {
        200: { description: 'Provider unlinked' },
        401: { description: 'Missing or invalid access token' },
      },
    },
  },
};
