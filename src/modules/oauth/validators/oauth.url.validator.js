import { z } from 'zod';

export const oauthUrlValidator = z.object({
  params: z.object({
    provider: z.enum(['google', 'github']).transform((v) => v.toUpperCase()),
  }),
});
