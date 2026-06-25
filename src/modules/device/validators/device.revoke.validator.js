import { z } from 'zod';

export const deviceRevokeValidator = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
