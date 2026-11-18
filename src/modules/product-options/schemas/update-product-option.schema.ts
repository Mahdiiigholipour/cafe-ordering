import z from "zod";
import { NameSchema, PriceDeltaSchema } from "./shared.schema";

export const UpdateProductOptionSchema = z
  .object({
    name: NameSchema,
    priceDelta: PriceDeltaSchema,
    isActive: z.boolean(),
  })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateProductOptionDto = z.output<typeof UpdateProductOptionSchema>;
