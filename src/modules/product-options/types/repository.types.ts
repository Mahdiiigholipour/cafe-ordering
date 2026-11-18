import { ProductOptionEntity } from "../product-option.entity";

export type CreateProductOptionsData = Pick<
  ProductOptionEntity,
  "name" | "type" | "priceDelta" | "productId" | "isActive"
>;

export type UpdateProductOptionsData = Partial<
  Pick<ProductOptionEntity, "name" | "priceDelta" | "isActive">
>;
