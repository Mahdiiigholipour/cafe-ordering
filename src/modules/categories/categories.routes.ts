import { Router } from "express";
import { categoriesService } from ".";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { createImageUpload } from "../../common/middlewares/upload.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { IdInParamsSchema } from "../../common/validations/id-in-params.schema";
import { authenticate } from "../auth";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { CategoriesController } from "./categories.controller";
import { CreateCategorySchema } from "./schemas/create-category.schema";
import { FilterCategoriesSchema } from "./schemas/filter-categories.schema";
import { UpdateCategorySchema } from "./schemas/update-category.schema";

const categoriesController = new CategoriesController(categoriesService);
const upload = createImageUpload("categories");
const router = Router();

router.use(authenticate);
router.get(
  "/",
  authorize(UserRoles.Staff),
  validate({ query: FilterCategoriesSchema }),
  categoriesController.getCategoriesList,
);
router.post(
  "/",
  authorize(),
  validate({ body: CreateCategorySchema }),
  categoriesController.createCategory,
);

router.get(
  "/:id",
  authorize(UserRoles.Staff),
  validate({ params: IdInParamsSchema }),
  categoriesController.getCategoryById,
);
router.patch(
  "/:id",
  authorize(),
  validate({ body: UpdateCategorySchema, params: IdInParamsSchema }),
  categoriesController.updateCategory,
);
router.delete(
  "/:id",
  authorize(),
  validate({ params: IdInParamsSchema }),
  categoriesController.deleteCategory,
);

router
  .route("/:id/image")
  .post(
    validate({ params: IdInParamsSchema }),
    authorize(),
    upload.single("image"),
    categoriesController.uploadCategoryImage,
  )
  .delete(
    validate({ params: IdInParamsSchema }),
    authorize(),
    categoriesController.deleteCategoryImage,
  );

export default router;
