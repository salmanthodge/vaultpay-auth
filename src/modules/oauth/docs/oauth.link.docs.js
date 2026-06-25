export const oauthLinkDocs = {
  '/auth/oauth/{provider}/link': {
    post: {
      tags: ['OAuth'],
      summary: 'Begin linking a provider to the authenticated account',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'provider', in: 'path', required: true, schema: { type: 'string', enum: ['google', 'github'] } },
      ],
      responses: {
        200: { description: 'Authorize URL (state bound to the user) to complete linking' },
        401: { description: 'Missing or invalid access token' },
      },
    },
  },
};
