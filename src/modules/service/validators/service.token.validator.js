import { z } from 'zod';

export const serviceTokenValidator = z.object({
  body: z
    .object({
      clientId: z.string().min(1).trim(),
      clientSecret: z.string().min(1),
    })
    .strict(),
});
