import { AppDataSource } from "../../database/data-source";
import { productsService } from "../products";
import { ProductOptionEntity } from "./product-option.entity";
import { ProductOptionsRepository } from "./product-options.repository";
import { ProductOptionsService } from "./product-options.service";

const productOptionRepositroy = new ProductOptionsRepository(
  AppDataSource.getRepository(ProductOptionEntity),
);

export const productOptionService = new ProductOptionsService(
  productOptionRepositroy,
  productsService,
);
