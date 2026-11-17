import { z } from "zod";

const TableNumberSchema = z.number().int().min(1).max(999);

export const CreateTableSchema = z
  .object({
    number: TableNumberSchema,
  })
  .strict();

export const UpdateTableSchema = z
  .object({
    number: TableNumberSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const ListTablesQuerySchema = z
  .object({
    isActive: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
  })
  .strict();

export type CreateTableDto = z.output<typeof CreateTableSchema>;
export type UpdateTableDto = z.output<typeof UpdateTableSchema>;
export type ListTablesQueryDto = z.output<typeof ListTablesQuerySchema>;
