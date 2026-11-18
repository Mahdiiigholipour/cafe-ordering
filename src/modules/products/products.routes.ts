import { Router } from "express";
import { productsService } from ".";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { createImageUpload } from "../../common/middlewares/upload.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { IdInParamsSchema } from "../../common/validations/id-in-params.schema";
import { authenticate } from "../auth";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { ProductsController } from "./products.controller";
import { CreateProductSchema } from "./schemas/create-product.schema";
import { FilterProductSchema } from "./schemas/filter-product.schema";
import { UpdateProductSchema } from "./schemas/update-product.schema";

const productsController = new ProductsController(productsService);
const upload = createImageUpload("products");
const router = Router();

router.use(authenticate);
router
  .route("/")
  .get(
    authorize(UserRoles.Staff),
    validate({ query: FilterProductSchema }),
    productsController.getProductsList,
  )
  .post(
    authorize(),
    validate({ body: CreateProductSchema }),
    productsController.createProduct,
  );

router.get(
  "/:id",
  authorize(UserRoles.Staff),
  validate({ params: IdInParamsSchema }),
  productsController.getProductById,
);

router.patch(
  "/:id",
  authorize(),
  validate({ params: IdInParamsSchema, body: UpdateProductSchema }),
  productsController.updateProduct,
);

router.delete(
  "/:id",
  authorize(),
  validate({ params: IdInParamsSchema }),
  productsController.deleteProduct,
);

router
  .route("/:id/image")
  .post(
    validate({ params: IdInParamsSchema }),
    authorize(),
    upload.single("image"),
    productsController.updateProductImage,
  )
  .delete(
    validate({ params: IdInParamsSchema }),
    authorize(),
    productsController.deleteProductImage,
  );

export default router;
