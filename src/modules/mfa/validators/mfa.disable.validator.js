import { z } from 'zod';

export const mfaDisableValidator = z.object({
  body: z
    .object({
      code: z.string().min(6).max(20).trim(),
    })
    .strict(),
});
