import { Router } from "express";
import { productOptionService } from ".";
import { validate } from "../../common/middlewares/validate.middleware";
import { authenticate } from "../auth";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { ProductOptionsController } from "./product-options.controller";
import { CreateProductOptionSchema } from "./schemas/create-product-option.schema";
import { ListProductOptionsQuerySchema } from "./schemas/list-product-option-query.schema";
import {
  ProductIdInParamsSchema,
  ProductOptionIdInParamsSchema,
} from "./schemas/shared.schema";
import { UpdateProductOptionSchema } from "./schemas/update-product-option.schema";

const controller = new ProductOptionsController(productOptionService);
const router = Router({ mergeParams: true });

router.use(authenticate, authorize());

router
  .route("/")
  .get(
    validate({
      params: ProductIdInParamsSchema,
      query: ListProductOptionsQuerySchema,
    }),
    controller.getProductOptionsList,
  )
  .post(
    validate({
      params: ProductIdInParamsSchema,
      body: CreateProductOptionSchema,
    }),
    controller.createProductOption,
  );

router
  .route("/:optionId")
  .get(
    validate({ params: ProductOptionIdInParamsSchema }),
    controller.getProductOptionById,
  )
  .patch(
    validate({
      params: ProductOptionIdInParamsSchema,
      body: UpdateProductOptionSchema,
    }),
    controller.updateProductOption,
  )
  .delete(
    validate({ params: ProductOptionIdInParamsSchema }),
    controller.deleteProductOption,
  );

export default router;
