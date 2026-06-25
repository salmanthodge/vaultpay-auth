import { z } from 'zod';

export const verifyEmailValidator = z.object({
  body: z
    .object({
      token: z.string().min(10),
    })
    .strict(),
});
