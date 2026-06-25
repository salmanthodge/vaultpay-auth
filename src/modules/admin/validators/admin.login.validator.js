import { z } from 'zod';

export const adminLoginValidator = z.object({
  body: z
    .object({
      email: z.string().email().toLowerCase().trim(),
      password: z.string().min(8).max(128),
    })
    .strict(),
});
