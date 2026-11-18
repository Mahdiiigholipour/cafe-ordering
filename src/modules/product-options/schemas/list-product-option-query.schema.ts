import z from "zod";

export const ListProductOptionsQuerySchema = z.object({
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export type ListProductOptionsQuery = z.output<
  typeof ListProductOptionsQuerySchema
>;
