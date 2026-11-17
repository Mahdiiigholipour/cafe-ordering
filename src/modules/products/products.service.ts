import path from "node:path";
import { ConflictError, NotFoundError } from "../../common/errors";
import { deleteUploadedFile } from "../../common/utils/file.util";
import env from "../../config/env";
import { CategoriesService } from "../categories/categories.service";
import { ProductEntity } from "./entities/product.entity";
import { ProductResponse } from "./interfaces/product-response.interface";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto } from "./schemas/create-product.schema";
import { FilterProductDto } from "./schemas/filter-product.schema";
import { UpdateProductDto } from "./schemas/update-product.schema";

export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async list(filters?: FilterProductDto) {
    const products = await this.productsRepo.findAll(filters);
    return products.map(this.toProductResponse);
  }

  async getById(id: string) {
    const product = await this.productsRepo.findById(id);
    if (!product) throw new NotFoundError("Product not found.");

    return this.toProductResponse(product);
  }

  async create(data: CreateProductDto) {
    const existsProduct = await this.productsRepo.findByName(data.name);
    if (existsProduct) throw new ConflictError("This product already exist");

    const category = await this.categoriesService.getById(data.categoryId);

    const created = await this.productsRepo.create(data);
    const product = await this.productsRepo.findById(created.id);
    return this.toProductResponse(product!);
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.productsRepo.findById(id);
    if (!product) throw new NotFoundError("Product not found");

    if (data.categoryId !== undefined)
      await this.categoriesService.getById(data.categoryId);

    if (
      data.name !== undefined &&
      data.name.toLowerCase() !== product.name.toLowerCase()
    ) {
      const existsProduct = await this.productsRepo.findByName(data.name);
      if (existsProduct) throw new ConflictError("This product already exist");
    }

    await this.productsRepo.update(product, data);
    const refreshed = await this.productsRepo.findById(id);
    return this.toProductResponse(refreshed!);
  }

  async delete(id: string) {
    // Will be complete after orders module developed
  }

  async updateImage(id: string, filePath: string) {
    const product = await this.productsRepo.findById(id);
    if (!product) throw new NotFoundError("Product not found");

    const relativePath = path.relative(env.UPLOADS_DIR, filePath);
    const oldImage = product.image;
    const updated = await this.productsRepo.updateImage(product, relativePath);

    if (oldImage) await deleteUploadedFile(oldImage);

    return this.toProductResponse(product);
  }

  async removeImage(id: string) {
    const product = await this.productsRepo.findById(id);
    if (!product) throw new NotFoundError("Product not found");

    const oldImage = product.image;
    const updated = await this.productsRepo.updateImage(product, null);
    if (oldImage) await deleteUploadedFile(oldImage);

    return this.toProductResponse(updated);
  }

  //---- Private handlers
  private toProductResponse(product: ProductEntity): ProductResponse {
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
}
