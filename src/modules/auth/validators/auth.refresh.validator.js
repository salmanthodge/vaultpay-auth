import { z } from 'zod';

export const refreshValidator = z.object({
  body: z
    .object({
      refreshToken: z.string().min(10),
    })
    .strict(),
});
