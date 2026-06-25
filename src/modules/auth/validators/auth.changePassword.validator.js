import { z } from 'zod';

export const changePasswordValidator = z.object({
  body: z
    .object({
      currentPassword: z.string().min(8).max(128),
      newPassword: z.string().min(8).max(128),
    })
    .strict(),
});
