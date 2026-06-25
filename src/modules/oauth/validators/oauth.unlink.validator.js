import { z } from 'zod';

export const oauthUnlinkValidator = z.object({
  params: z.object({
    provider: z.enum(['google', 'github']).transform((v) => v.toUpperCase()),
  }),
});
