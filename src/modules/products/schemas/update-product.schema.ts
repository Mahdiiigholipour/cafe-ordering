import z from "zod";

export const UpdateProductSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    price: z.number().int().positive().optional(),
    categoryId: z.string().uuid().optional(),
    description: z.string().trim().max(500).nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0);

export type UpdateProductDto = z.output<typeof UpdateProductSchema>;
