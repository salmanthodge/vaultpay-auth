export const oauthCallbackDocs = {
  '/auth/oauth/{provider}/callback': {
    get: {
      tags: ['OAuth'],
      summary: 'OAuth redirect callback — exchanges the code and signs in/links',
      parameters: [
        { name: 'provider', in: 'path', required: true, schema: { type: 'string', enum: ['google', 'github'] } },
        { name: 'code', in: 'query', required: true, schema: { type: 'string' } },
        { name: 'state', in: 'query', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Signed in (tokens) or provider linked' },
        400: { description: 'Invalid state / provider not configured / exchange failed' },
        422: { description: 'Validation error' },
      },
    },
  },
};
