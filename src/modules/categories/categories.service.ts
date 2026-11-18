import path from "node:path";
import { CategoriesMessages } from "../../common/enums/messages/categories.messages";
import { ConflictError, NotFoundError } from "../../common/errors";
import { deleteUploadedFile } from "../../common/utils/file.util";
import env from "../../config/env";
import { CategoriesRepository } from "./categories.repository";
import { CategoryEntity } from "./category.entity";
import { CreateCategoryDto } from "./schemas/create-category.schema";
import { UpdateCategoryDto } from "./schemas/update-category.schema";
import { CategoriesResponse } from "./types/category-response.interface";

export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async list(isActive?: boolean) {
    const categories = await this.categoriesRepo.findAll({ isActive });
    return categories.map(this.toResponse);
  }

  async getById(id: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    return this.toResponse(category);
  }

  async create(dto: CreateCategoryDto) {
    const existCategory = await this.categoriesRepo.findByName(dto.name);
    if (existCategory)
      throw new ConflictError(CategoriesMessages.CATEGORY_ALREADY_EXISTS);

    const created = await this.categoriesRepo.create(dto);
    return this.toResponse(created);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    if (
      dto.name !== undefined &&
      dto.name.toLowerCase() !== category.name.toLowerCase()
    ) {
      const existCategory = await this.categoriesRepo.findByName(dto.name);
      if (existCategory)
        throw new ConflictError(CategoriesMessages.CATEGORY_ALREADY_EXISTS);
    }

    const updated = await this.categoriesRepo.update(category, dto);
    return this.toResponse(updated);
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

  async updateImage(id: string, filePath: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    const relativePath = path.relative(env.UPLOADS_DIR, filePath);
    const oldImage = category.image;
    const updated = await this.categoriesRepo.updateImage(
      category,
      relativePath,
    );

    if (oldImage) await deleteUploadedFile(oldImage);

    return this.toResponse(updated);
  }

  async removeImage(id: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category)
      throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    if (!category.image) return;

    const oldImage = category.image;
    const updated = await this.categoriesRepo.updateImage(category, null);
    await deleteUploadedFile(oldImage);

    return this.toResponse(updated);
  }

  // ----- Private helpers -----

  private toResponse(category: CategoryEntity): CategoriesResponse {
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
