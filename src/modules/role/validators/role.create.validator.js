import { z } from 'zod';

export const roleCreateValidator = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .transform((v) => v.toUpperCase()),
      description: z.string().max(200).trim().optional(),
      permissions: z.array(z.string()).optional(),
    })
    .strict(),
});
