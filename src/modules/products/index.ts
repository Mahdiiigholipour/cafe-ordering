import { AppDataSource } from "../../database/data-source";
import { categoriesService } from "../categories";
import { ProductEntity } from "./entities/product.entity";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

const productsRepository = new ProductsRepository(
  AppDataSource.getRepository(ProductEntity),
);

export const productsService = new ProductsService(
  productsRepository,
  categoriesService,
);
