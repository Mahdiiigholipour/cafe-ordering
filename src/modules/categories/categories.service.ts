import path from "node:path";
import { ConflictError, NotFoundError } from "../../common/errors";
import { deleteUploadedFile } from "../../common/utils/file.util";
import env from "../../config/env";
import { CategoriesMessages } from "./categories.messages";
import { CategoriesRepository } from "./categories.repository";
import { CategoryEntity } from "./category.entity";
import { CreateCategoryDto } from "./schemas/create-category.schema";
import { UpdateCategoryDto } from "./schemas/update-category.schema";
import { CategoriesResponse } from "./types/category-response.interface";

export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  public async list(isActive?: boolean) {
    const categories = await this.repository.findAll({ isActive });
    return categories.map((category) => this.toResponse(category));
  }

  public async getById(id: string) {
    const category = await this.getEntityOrThrow(id);
    return this.toResponse(category);
  }

  public async create(dto: CreateCategoryDto) {
    const existCategory = await this.repository.findByName(dto.name);
    if (existCategory)
      throw new ConflictError(CategoriesMessages.CATEGORY_ALREADY_EXISTS);

    const created = await this.repository.create(dto);
    return this.toResponse(created);
  }

  public async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.getEntityOrThrow(id);

    if (
      dto.name !== undefined &&
      dto.name.toLowerCase() !== category.name.toLowerCase()
    ) {
      const existCategory = await this.repository.findByName(dto.name);
      if (existCategory)
        throw new ConflictError(CategoriesMessages.CATEGORY_ALREADY_EXISTS);
    }

    const updated = await this.repository.update(category, dto);
    return this.toResponse(updated);
  }

  public async delete(id: string) {
    const category = await this.getEntityOrThrow(id);

    const productsCount = await this.repository.countProductsByCategoryId(id);
    if (productsCount > 0)
      throw new ConflictError(CategoriesMessages.CATEGORY_HAS_PRODUCTS);

    await this.repository.delete(category);
  }

  public async updateImage(id: string, filePath: string) {
    const category = await this.getEntityOrThrow(id);

    const relativePath = path.relative(env.UPLOADS_DIR, filePath);
    const oldImage = category.image;
    const updated = await this.repository.updateImage(category, relativePath);

    if (oldImage) await deleteUploadedFile(oldImage);

    return this.toResponse(updated);
  }

  public async removeImage(id: string) {
    const category = await this.getEntityOrThrow(id);

    if (!category.image) return;

    const oldImage = category.image;
    const updated = await this.repository.updateImage(category, null);
    await deleteUploadedFile(oldImage);

    return this.toResponse(updated);
  }

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

  private async getEntityOrThrow(id: string) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundError(CategoriesMessages.CATEGORY_NOT_FOUND);

    return entity;
  }
}
