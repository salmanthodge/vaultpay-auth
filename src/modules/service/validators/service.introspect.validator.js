import { z } from 'zod';

export const serviceIntrospectValidator = z.object({
  body: z
    .object({
      token: z.string().min(10),
    })
    .strict(),
});
