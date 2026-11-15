import z from "zod";

export const FilterCategoriesSchema = z.object({
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export type FilterCategoriesDto = z.output<typeof FilterCategoriesSchema>;
