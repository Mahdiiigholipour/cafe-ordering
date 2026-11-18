import z from "zod";
import { ValidationMessages } from "../../../common/constants/validation.messages";
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
    message: ValidationMessages.AT_LEAST_ONE_FIELD,
  });

export type UpdateProductOptionDto = z.output<typeof UpdateProductOptionSchema>;
