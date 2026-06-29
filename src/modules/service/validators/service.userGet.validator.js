import { z } from 'zod';

export const serviceUserGetValidator = z.object({
  params: z.object({ id: z.string().uuid() }),
});
