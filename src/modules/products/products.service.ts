import path from "node:path";
import { ConflictError, NotFoundError } from "../../common/errors";
import { deleteUploadedFile } from "../../common/utils/file.util";
import env from "../../config/env";
import { CategoriesService } from "../categories/categories.service";
import { ProductEntity } from "./product.entity";
import { ProductsMessages } from "./products.messages";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto } from "./schemas/create-product.schema";
import { FilterProductDto } from "./schemas/filter-product.schema";
import { UpdateProductDto } from "./schemas/update-product.schema";
import { ProductsResponse } from "./types/products-response.interface";

export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async list(filters?: FilterProductDto) {
    const products = await this.productsRepo.findAll(filters);
    return products.map((product) => this.toResponse(product));
  }

  public async getById(id: string) {
    const product = await this.getEntityOrThrow(id);
    return this.toResponse(product);
  }

  public async create(data: CreateProductDto) {
    const existsProduct = await this.productsRepo.findByName(data.name);
    if (existsProduct)
      throw new ConflictError(ProductsMessages.PRODUCT_ALREADY_EXISTS);

    await this.categoriesService.getById(data.categoryId);

    const created = await this.productsRepo.create(data);
    const product = await this.productsRepo.findById(created.id);
    return this.toResponse(product!);
  }

  public async update(id: string, data: UpdateProductDto) {
    const product = await this.getEntityOrThrow(id);

    if (data.categoryId !== undefined)
      await this.categoriesService.getById(data.categoryId);

    if (
      data.name !== undefined &&
      data.name.toLowerCase() !== product.name.toLowerCase()
    ) {
      const existsProduct = await this.productsRepo.findByName(data.name);
      if (existsProduct)
        throw new ConflictError(ProductsMessages.PRODUCT_ALREADY_EXISTS);
    }

    await this.productsRepo.update(product, data);
    const refreshed = await this.productsRepo.findById(id);
    return this.toResponse(refreshed!);
  }

  public async delete(id: string) {
    // Will be complete after orders module developed
  }

  public async updateImage(id: string, filePath: string) {
    const product = await this.getEntityOrThrow(id);

    const relativePath = path.relative(env.UPLOADS_DIR, filePath);
    const oldImage = product.image;
    const updated = await this.productsRepo.updateImage(product, relativePath);

    if (oldImage) await deleteUploadedFile(oldImage);

    return this.toResponse(updated);
  }

  public async removeImage(id: string) {
    const product = await this.getEntityOrThrow(id);

    const oldImage = product.image;
    const updated = await this.productsRepo.updateImage(product, null);
    if (oldImage) await deleteUploadedFile(oldImage);

    return this.toResponse(updated);
  }

  private toResponse(product: ProductEntity): ProductsResponse {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      isActive: product.isActive,
      categoryId: product.categoryId,
      category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private async getEntityOrThrow(id: string) {
    const entity = await this.productsRepo.findById(id);
    if (!entity) throw new NotFoundError(ProductsMessages.PRODUCT_NOT_FOUND);

    return entity;
  }
}
