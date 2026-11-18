import z from "zod";
import { ProductOptionTypes } from "../../../common/enums/product-option-type.enum";
import { ProductOptionsMessages } from "../product-options.messages";
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
      message: ProductOptionsMessages.REMOVAL_OPTION_PRICE_NOT_ALLOWED,
      path: ["priceDelta"],
    },
  );

export type CreateProductOptionDto = z.output<typeof CreateProductOptionSchema>;
