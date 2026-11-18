import { ProductOptionTypes } from "../../../common/enums/product-option-type.enum";

export interface ProductOptionsResponse {
  id: string;
  name: string;
  type: ProductOptionTypes;
  priceDelta: number;
  isActive: boolean;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
