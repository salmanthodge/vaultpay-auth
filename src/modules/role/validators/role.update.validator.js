import { z } from 'zod';

export const roleUpdateValidator = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .transform((v) => v.toUpperCase())
        .optional(),
      description: z.string().max(200).trim().optional(),
      permissions: z.array(z.string()).optional(),
    })
    .strict()
    .refine((b) => Object.keys(b).length > 0, { message: 'No fields to update' }),
});
