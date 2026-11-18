import { NextFunction, Request, Response } from "express";
import { UploadsMessages } from "../../common/constants/uploads.messages";
import { BadRequestError } from "../../common/errors";
import { IdInParamsDto } from "../../common/validations/id-in-params.schema";
import { ProductsMessages } from "./products.messages";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./schemas/create-product.schema";
import { FilterProductDto } from "./schemas/filter-product.schema";
import { UpdateProductDto } from "./schemas/update-product.schema";

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  getProductsList = async (req: Request, res: Response, next: NextFunction) => {
    const query: FilterProductDto = res.locals.validatedQuery;

    const products = await this.productsService.list(query);

    return res.status(200).json({ success: true, data: products });
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const dto: CreateProductDto = res.locals.validatedBody;

    const product = await this.productsService.create(dto);

    return res.status(201).json({
      success: true,
      message: ProductsMessages.PRODUCT_CREATED,
      data: product,
    });
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const params: IdInParamsDto = res.locals.validatedParams;

    const product = await this.productsService.getById(params.id);

    return res.status(200).json({ success: true, data: product });
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    const dto: UpdateProductDto = res.locals.validatedBody;

    const product = await this.productsService.update(params.id, dto);

    return res.status(200).json({
      success: true,
      message: ProductsMessages.PRODUCT_UPDATED,
      data: product,
    });
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestError(ProductsMessages.PRODUCT_DELETED);
  };

  updateProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    if (!req.file) throw new BadRequestError(UploadsMessages.FILE_REQUIRED);

    const product = await this.productsService.updateImage(
      params.id,
      req.file.path,
    );

    return res.status(200).json({
      success: true,
      message: ProductsMessages.PRODUCT_IMAGE_UPDATED,
      data: product,
    });
  };

  deleteProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const params: IdInParamsDto = res.locals.validatedParams;

    const product = await this.productsService.removeImage(params.id);
    return res.status(200).json({
      success: true,
      message: ProductsMessages.PRODUCT_IMAGE_REMOVED,
      data: product,
    });
  };
}
