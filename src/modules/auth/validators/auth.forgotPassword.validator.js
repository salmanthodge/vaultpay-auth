import { z } from 'zod';

export const forgotPasswordValidator = z.object({
  body: z
    .object({
      email: z.string().email().toLowerCase().trim(),
    })
    .strict(),
});
