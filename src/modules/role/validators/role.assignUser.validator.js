import { z } from 'zod';

export const roleAssignUserValidator = z.object({
  params: z.object({ userId: z.string().uuid() }),
  body: z
    .object({
      roleId: z.string().uuid(),
    })
    .strict(),
});
