import { z } from 'zod';

export const serviceUserStatusValidator = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      status: z.enum(['ACTIVE', 'SUSPENDED']),
    })
    .strict(),
});
