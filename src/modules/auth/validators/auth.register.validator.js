import { z } from 'zod';

export const registerValidator = z.object({
  body: z
    .object({
      email: z.string().email().toLowerCase().trim(),
      password: z.string().min(8).max(128),
      fullName: z.string().min(1).max(120).trim().optional(),
      phone: z.string().min(7).max(20).trim().optional(),
    })
    .strict(),
});
