import { CategoriesMessages } from "../../common/enums/messages/categories.messages";
import { ConflictError, NotFoundError } from "../../common/errors";
import { CategoriesRepository } from "./categories.repository";
import { CategoryEntity } from "./category.entity";
import { CategoryResponse } from "./interfaces/category-response.interface";

export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async getAll(isActive?: boolean) {
    const categories = await this.categoriesRepo.findAll({ isActive });
    return categories.map(this.toCategoryResponse);
  }

  async getById(id: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    return this.toCategoryResponse(category);
  }

  async create(dto: any) {
    const existCategory = await this.categoriesRepo.findByName(dto.name);
    if (existCategory)
      throw new ConflictError(CategoriesMessages.CATEGORY_ALREADY_EXISTS);

    const created = await this.categoriesRepo.create(dto);
    return this.toCategoryResponse(created);
  }

  async update(id: string, dto: any) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    if (dto.name !== undefined && dto.name !== category.name) {
      const existCategory = await this.categoriesRepo.findByName(dto.name);
      if (existCategory)
        throw new ConflictError(CategoriesMessages.CATEGORY_ALREADY_EXISTS);
    }

    const updated = await this.categoriesRepo.update(category, dto);
    return this.toCategoryResponse(updated);
  }

  async delete(id: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    const productsCount =
      await this.categoriesRepo.countProductsByCategoryId(id);
    if (productsCount > 0)
      throw new ConflictError(CategoriesMessages.CATEGORY_HAS_PRODUCTS);

    await this.categoriesRepo.delete(id);
  }

  // ----- Private helpers -----

  private toCategoryResponse(category: CategoryEntity): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
