import { FindOptionsWhere, Repository } from "typeorm";
import { ProductEntity } from "../products/entities/product.entity";
import { CategoryEntity } from "./category.entity";

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

  async create(data: Pick<CategoryEntity, "name" | "description" | "image">) {
    const category = this.repository.create(data);
    return this.repository.save(category);
  }

  async update(category: CategoryEntity, data: Partial<CategoryEntity>) {
    if (data.description !== undefined) category.description = data.description;
    if (data.name !== undefined) category.name = data.name;
    if (data.isActive !== undefined) category.isActive = data.isActive;
    if (data.image !== undefined) category.image = data.image;

    return this.repository.save(category);
  }

  async delete(id: string) {
    return this.repository.delete({ id });
  }

  async countProductsByCategoryId(categoryId: string) {
    return this.productsRepository.countBy({ categoryId });
  }
}
