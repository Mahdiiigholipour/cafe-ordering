import z from "zod";
import { ProductOptionTypes } from "../enums/product-option-type.enum";
import { NameSchema, PriceDeltaSchema } from "./shared.schema";

export const CreateProductOptionSchema = z
  .object({
    name: NameSchema,
    type: z.enum(ProductOptionTypes),
    priceDelta: PriceDeltaSchema.default(0),
    isActive: z.boolean().default(true),
  })
  .strict()
  .refine(
    (data) => data.type !== ProductOptionTypes.Removal || data.priceDelta === 0,
    {
      message: "Removal options cannot have a price",
      path: ["priceDelta"],
    },
  );

export type CreateProductOptionDto = z.output<typeof CreateProductOptionSchema>;
