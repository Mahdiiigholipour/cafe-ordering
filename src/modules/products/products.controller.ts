import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../common/errors";
import { IdInParamsDto } from "../../common/validations/id-in-params.schema";
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
      message: "Product created successfully",
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
      message: "Product updated successfully",
      data: product,
    });
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestError("Delete products not available");
  };

  updateProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    if (!req.file) throw new BadRequestError("Please upload file");

    const product = await this.productsService.updateImage(
      params.id,
      req.file.path,
    );

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully",
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
    return res
      .status(200)
      .json({
        success: true,
        message: "Product image removed successfully",
        data: product,
      });
  };
}
