import z from "zod";

export const NameSchema = z.string().trim().min(1).max(100);
export const PriceDeltaSchema = z.number().int().min(0);

export const ProductIdInParamsSchema = z.object({
  productId: z.uuid(),
});

export const ProductOptionIdInParamsSchema = z.object({
  productId: z.uuid(),
  optionId: z.uuid(),
});

export type ProductIdInParamsDto = z.output<typeof ProductIdInParamsSchema>;

export type ProductOptionIdInParamsDto = z.output<
  typeof ProductOptionIdInParamsSchema
>;
