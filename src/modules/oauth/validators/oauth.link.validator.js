import { z } from 'zod';

export const oauthLinkValidator = z.object({
  params: z.object({
    provider: z.enum(['google', 'github']).transform((v) => v.toUpperCase()),
  }),
});
