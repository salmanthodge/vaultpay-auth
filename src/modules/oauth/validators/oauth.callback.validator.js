import { z } from 'zod';

export const oauthCallbackValidator = z.object({
  params: z.object({
    provider: z.enum(['google', 'github']).transform((v) => v.toUpperCase()),
  }),
  query: z
    .object({
      code: z.string().min(1),
      state: z.string().min(1),
    })
    .strip(),
});
