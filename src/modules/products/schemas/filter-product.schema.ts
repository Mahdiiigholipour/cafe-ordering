import z from "zod";

export const FilterProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().trim().min(1).optional(),
});

export type FilterProductDto = z.output<typeof FilterProductSchema>;
