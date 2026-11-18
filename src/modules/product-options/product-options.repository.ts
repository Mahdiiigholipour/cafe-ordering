import { FindOptionsWhere, Repository } from "typeorm";
import { ProductOptionTypes } from "./enums/product-option-type.enum";
import { ProductOptionEntity } from "./product-option.entity";
import {
  CreateProductOptionsData,
  UpdateProductOptionsData,
} from "./types/product-options-repository.types";

export class ProductOptionsRepository {
  constructor(private readonly repository: Repository<ProductOptionEntity>) {}

  async findByProductId(productId: string, filters?: { isActive?: boolean }) {
    const where: FindOptionsWhere<ProductOptionEntity> = { productId };
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return this.repository.find({
      where,
      order: { type: "ASC", createdAt: "ASC" },
    });
  }

  async findByIdAndProductId(optionId: string, productId: string) {
    return this.repository.findOne({ where: { id: optionId, productId } });
  }

  async findByProductTypeAndName(
    productId: string,
    type: ProductOptionTypes,
    name: string,
  ) {
    return this.repository.findOne({ where: { productId, type, name } });
  }

  async create(data: CreateProductOptionsData) {
    const option = this.repository.create(data);
    return this.repository.save(option);
  }

  async update(option: ProductOptionEntity, data: UpdateProductOptionsData) {
    if (data.name !== undefined) option.name = data.name;
    if (data.priceDelta !== undefined) option.priceDelta = data.priceDelta;
    if (data.isActive !== undefined) option.isActive = data.isActive;

    return this.repository.save(option);
  }

  async delete(option: ProductOptionEntity) {
    await this.repository.remove(option);
  }
}
