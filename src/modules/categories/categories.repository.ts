import { FindOptionsWhere, Repository } from "typeorm";
import { ProductEntity } from "../products/product.entity";
import { CategoryEntity } from "./category.entity";
import {
  CreateCategoryDataType,
  UpdateCategoryDataType,
} from "./types/category-repository.types";

export class CategoriesRepository {
  constructor(
    private readonly repository: Repository<CategoryEntity>,
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async findByName(name: string) {
    return this.repository.findOneBy({ name });
  }

  async findAll(filters?: { isActive: boolean | undefined }) {
    const where: FindOptionsWhere<CategoryEntity> = {};

    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return this.repository.find({ where });
  }

  async create(data: CreateCategoryDataType) {
    const category = this.repository.create(data);
    return this.repository.save(category);
  }

  async update(category: CategoryEntity, data: UpdateCategoryDataType) {
    if (data.description !== undefined) category.description = data.description;
    if (data.name !== undefined) category.name = data.name;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    return this.repository.save(category);
  }

  async updateImage(category: CategoryEntity, image: string | null) {
    category.image = image;
    return this.repository.save(category);
  }

  async delete(category: CategoryEntity) {
    return this.repository.remove(category);
  }

  async countProductsByCategoryId(categoryId: string) {
    return this.productsRepository.countBy({ categoryId });
  }
}
