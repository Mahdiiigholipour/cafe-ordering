import { Request, Response } from "express";
import { ProductOptionsMessages } from "./product-options.messages";
import { ProductOptionsService } from "./product-options.service";
import { CreateProductOptionDto } from "./schemas/create-product-option.schema";
import { ListProductOptionsQuery } from "./schemas/list-product-option-query.schema";
import {
  ProductIdInParamsDto,
  ProductOptionIdInParamsDto,
} from "./schemas/shared.schema";
import { UpdateProductOptionDto } from "./schemas/update-product-option.schema";

export class ProductOptionsController {
  constructor(private readonly service: ProductOptionsService) {}

  getProductOptionsList = async (_req: Request, res: Response) => {
    const params: ProductIdInParamsDto = res.locals.validatedParams;
    const query: ListProductOptionsQuery = res.locals.validatedQuery;
    const list = await this.service.list(params.productId, query);

    return res.status(200).json({ success: true, data: list });
  };

  getProductOptionById = async (_req: Request, res: Response) => {
    const params: ProductOptionIdInParamsDto = res.locals.validatedParams;
    const productOption = await this.service.getById(
      params.productId,
      params.optionId,
    );

    return res.status(200).json({ success: true, data: productOption });
  };

  createProductOption = async (_req: Request, res: Response) => {
    const params: ProductIdInParamsDto = res.locals.validatedParams;
    const dto: CreateProductOptionDto = res.locals.validatedBody;
    const created = await this.service.create(params.productId, dto);

    return res.status(201).json({
      success: true,
      message: ProductOptionsMessages.PRODUCT_OPTION_CREATED,
      data: created,
    });
  };

  updateProductOption = async (_req: Request, res: Response) => {
    const params: ProductOptionIdInParamsDto = res.locals.validatedParams;
    const dto: UpdateProductOptionDto = res.locals.validatedBody;
    const updated = await this.service.update(
      params.productId,
      params.optionId,
      dto,
    );

    return res.status(200).json({
      success: true,
      message: ProductOptionsMessages.PRODUCT_OPTION_UPDATED,
      data: updated,
    });
  };

  deleteProductOption = async (_req: Request, res: Response) => {
    const params: ProductOptionIdInParamsDto = res.locals.validatedParams;
    await this.service.delete(params.productId, params.optionId);

    return res.status(200).json({
      success: true,
      message: ProductOptionsMessages.PRODUCT_OPTION_DELETED,
    });
  };
}
