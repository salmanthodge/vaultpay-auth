export const oauthUrlDocs = {
  '/auth/oauth/{provider}/url': {
    get: {
      tags: ['OAuth'],
      summary: 'Get the provider authorize URL (begin sign-in)',
      parameters: [
        {
          name: 'provider',
          in: 'path',
          required: true,
          schema: { type: 'string', enum: ['google', 'github'] },
        },
      ],
      responses: {
        200: { description: 'Authorize URL and CSRF state' },
        422: { description: 'Unsupported provider' },
      },
    },
  },
};
