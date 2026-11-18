import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/errors";
import { ProductsService } from "../products/products.service";
import { ProductOptionTypes } from "./enums/product-option-type.enum";
import { ProductOptionEntity } from "./product-option.entity";
import { ProductOptionsMessages } from "./product-options.messages";
import { ProductOptionsRepository } from "./product-options.repository";
import { CreateProductOptionDto } from "./schemas/create-product-option.schema";
import { ListProductOptionsQuery } from "./schemas/list-product-option-query.schema";
import { UpdateProductOptionDto } from "./schemas/update-product-option.schema";
import { ProductOptionsResponse } from "./types/product-options-response.interface";

export class ProductOptionsService {
  constructor(
    private readonly repository: ProductOptionsRepository,
    private readonly productsService: ProductsService,
  ) {}

  public async list(productId: string, filters?: ListProductOptionsQuery) {
    await this.productsService.getById(productId);

    const options = await this.repository.findByProductId(productId, filters);
    return options.map((option) => this.toResponse(option));
  }

  public async getById(productId: string, optionId: string) {
    await this.productsService.getById(productId);

    const option = await this.getEntityOrThrow(optionId, productId);
    return this.toResponse(option);
  }

  public async create(productId: string, dto: CreateProductOptionDto) {
    await this.productsService.getById(productId);

    const exists = await this.repository.findByProductTypeAndName(
      productId,
      dto.type,
      dto.name,
    );
    if (exists)
      throw new ConflictError(
        ProductOptionsMessages.PRODUCT_OPTION_ALREADY_EXISTS,
      );

    const created = await this.repository.create({ ...dto, productId });
    return this.toResponse(created);
  }

  public async update(
    productId: string,
    optionId: string,
    dto: UpdateProductOptionDto,
  ) {
    await this.productsService.getById(productId);
    const current = await this.getEntityOrThrow(optionId, productId);

    if (
      current.type === ProductOptionTypes.Removal &&
      dto.priceDelta !== undefined &&
      dto.priceDelta !== 0
    )
      throw new BadRequestError(
        ProductOptionsMessages.REMOVAL_OPTION_PRICE_INVALID,
      );

    if (dto.name !== undefined) {
      const exists = await this.repository.findByProductTypeAndName(
        productId,
        current.type,
        dto.name,
      );
      if (exists && exists.id !== current.id)
        throw new ConflictError(
          ProductOptionsMessages.PRODUCT_OPTION_ALREADY_EXISTS,
        );
    }

    const updated = await this.repository.update(current, dto);
    return this.toResponse(updated);
  }

  public async delete(productId: string, optionId: string) {
    await this.productsService.getById(productId);

    const option = await this.getEntityOrThrow(optionId, productId);
    await this.repository.delete(option);
  }

  private toResponse(option: ProductOptionEntity): ProductOptionsResponse {
    return {
      id: option.id,
      name: option.name,
      type: option.type,
      isActive: option.isActive,
      priceDelta: option.priceDelta,
      productId: option.productId,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    };
  }

  private async getEntityOrThrow(optionId: string, productId: string) {
    const entity = await this.repository.findByIdAndProductId(
      optionId,
      productId,
    );
    if (!entity)
      throw new NotFoundError(ProductOptionsMessages.PRODUCT_OPTION_NOT_FOUND);

    return entity;
  }
}
