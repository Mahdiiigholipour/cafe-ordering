import { ProductEntity } from "../product.entity";

export type FilterProductDataType = Partial<
  Pick<ProductEntity, "categoryId" | "isActive">
> & { search?: string };

export type CreateProductDataType = Pick<
  ProductEntity,
  "name" | "price" | "categoryId" | "description"
>;

export type UpdateProductDataType = Partial<
  Pick<
    ProductEntity,
    "name" | "price" | "categoryId" | "description" | "isActive"
  >
>;
