import { z } from 'zod';

export const mfaEnableValidator = z.object({
  body: z
    .object({
      code: z.string().regex(/^\d{6}$/, 'Expected a 6-digit TOTP code'),
    })
    .strict(),
});
