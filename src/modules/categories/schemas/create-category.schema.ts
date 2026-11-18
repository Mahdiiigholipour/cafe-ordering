import z from "zod";

export const CreateCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(255).nullable().default(null),
  })
  .strict();

export type CreateCategoryDto = z.output<typeof CreateCategorySchema>;
