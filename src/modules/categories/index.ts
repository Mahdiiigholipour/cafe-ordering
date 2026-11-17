import { AppDataSource } from "../../database/data-source";
import { ProductEntity } from "../products/product.entity";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { CategoryEntity } from "./category.entity";

const categoriesRepository = new CategoriesRepository(
  AppDataSource.getRepository(CategoryEntity),
  AppDataSource.getRepository(ProductEntity),
);

export const categoriesService = new CategoriesService(categoriesRepository);
