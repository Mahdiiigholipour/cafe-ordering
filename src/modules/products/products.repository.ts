import { FindOptionsWhere, Like, Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import {
  CreateProductDataType,
  FilterProductDataType,
  UpdateProductDataType,
} from "./types/repository.types";

export class ProductsRepository {
  constructor(private readonly repository: Repository<ProductEntity>) {}

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async findByName(name: string) {
    return this.repository.findOne({
      where: { name },
      relations: { category: true },
    });
  }

  async findAll(filters?: FilterProductDataType) {
    const baseWhere: FindOptionsWhere<ProductEntity> = {};
    if (filters?.categoryId !== undefined)
      baseWhere.categoryId = filters.categoryId;
    if (filters?.isActive !== undefined) baseWhere.isActive = filters.isActive;

    let where:
      | FindOptionsWhere<ProductEntity>
      | FindOptionsWhere<ProductEntity>[] = baseWhere;

    if (filters?.search) {
      const like = Like(`%${filters.search}%`);
      where = [
        { ...baseWhere, name: like },
        { ...baseWhere, description: like },
      ];
    }

    return this.repository.find({
      where,
      relations: { category: true },
    });
  }

  async create(data: CreateProductDataType) {
    const product = this.repository.create(data);
    return this.repository.save(product);
  }

  async update(product: ProductEntity, data: UpdateProductDataType) {
    if (data.categoryId !== undefined) product.categoryId = data.categoryId;
    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) product.price = data.price;
    if (data.isActive !== undefined) product.isActive = data.isActive;

    return this.repository.save(product);
  }

  async delete(id: string) {
    // Will be complete after orders module developed
  }

  async updateImage(product: ProductEntity, image: string | null) {
    product.image = image;
    return this.repository.save(product);
  }
}
