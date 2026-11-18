import { Request, Response } from "express";
import { UploadsMessages } from "../../common/constants/uploads.messages";
import { BadRequestError } from "../../common/errors";
import { IdInParamsDto } from "../../common/validations/id-in-params.schema";
import { CategoriesMessages } from "./categories.messages";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./schemas/create-category.schema";
import { FilterCategoriesDto } from "./schemas/filter-categories.schema";
import { UpdateCategoryDto } from "./schemas/update-category.schema";

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  getCategoriesList = async (req: Request, res: Response) => {
    const query: FilterCategoriesDto = res.locals.validatedQuery;
    const categories = await this.categoriesService.list(query.isActive);

    return res.status(200).json({ success: true, data: categories });
  };

  getCategoryById = async (req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    const category = await this.categoriesService.getById(params.id);

    return res.status(200).json({ success: true, data: category });
  };

  createCategory = async (req: Request, res: Response) => {
    const createDto: CreateCategoryDto = res.locals.validatedBody;
    const category = await this.categoriesService.create(createDto);

    return res.status(201).json({
      success: true,
      message: CategoriesMessages.CATEGORY_CREATED,
      data: category,
    });
  };

  updateCategory = async (req: Request, res: Response) => {
    const updateDto: UpdateCategoryDto = res.locals.validatedBody;
    const params: IdInParamsDto = res.locals.validatedParams;
    const category = await this.categoriesService.update(params.id, updateDto);

    return res.status(200).json({
      success: true,
      message: CategoriesMessages.CATEGORY_UPDATED,
      data: category,
    });
  };

  deleteCategory = async (req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    await this.categoriesService.delete(params.id);

    return res
      .status(200)
      .json({ success: true, message: CategoriesMessages.CATEGORY_DELETED });
  };

  uploadCategoryImage = async (req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;

    if (!req.file) throw new BadRequestError(UploadsMessages.FILE_REQUIRED);

    const category = await this.categoriesService.updateImage(
      params.id,
      req.file.path,
    );

    return res.status(200).json({
      success: true,
      message: CategoriesMessages.IMAGE_UPDATED,
      data: category,
    });
  };

  deleteCategoryImage = async (req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;

    const category = await this.categoriesService.removeImage(params.id);

    return res.status(200).json({
      success: true,
      message: CategoriesMessages.IMAGE_REMOVED,
      data: category,
    });
  };
}
