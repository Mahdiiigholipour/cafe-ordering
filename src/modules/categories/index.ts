import { AppDataSource } from "../../database/data-source";
import { ProductEntity } from "../products/entities/product.entity";
import { CategoriesRepository } from "./categories.repository";
import { CategoryEntity } from "./category.entity";

const categoriesRepository = new CategoriesRepository(
  AppDataSource.getRepository(CategoryEntity),
  AppDataSource.getRepository(ProductEntity),
);
