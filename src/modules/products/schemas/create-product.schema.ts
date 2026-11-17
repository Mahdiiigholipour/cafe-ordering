import z from "zod";

export const CreateProductSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    price: z.number().int().positive(),
    categoryId: z.string().uuid(),
    description: z.string().trim().max(500).nullable().optional(),
  })
  .strict();

export type CreateProductDto = z.output<typeof CreateProductSchema>;
