import { z } from 'zod';

export const mfaVerifyValidator = z.object({
  body: z
    .object({
      mfaToken: z.string().min(10),
      // TOTP (6 digits) or a backup code (hex) — accept a range
      code: z.string().min(6).max(20).trim(),
    })
    .strict(),
});
