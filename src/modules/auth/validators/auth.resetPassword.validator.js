import { z } from 'zod';

export const resetPasswordValidator = z.object({
  body: z
    .object({
      token: z.string().min(10),
      password: z.string().min(8).max(128),
    })
    .strict(),
});
