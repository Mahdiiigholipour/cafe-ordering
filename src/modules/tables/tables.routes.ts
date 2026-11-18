import { Router } from "express";
import { tablesService } from ".";
import { validate } from "../../common/middlewares/validate.middleware";
import { IdInParamsSchema } from "../../common/validations/id-in-params.schema";
import { authenticate } from "../auth";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { TablesController } from "./tables.controller";
import {
  CreateTableSchema,
  ListTablesQuerySchema,
  UpdateTableSchema,
} from "./tables.schema";

const tablesController = new TablesController(tablesService);
const router = Router();

router.use(authenticate, authorize());
router
  .route("/")
  .get(
    validate({ query: ListTablesQuerySchema }),
    tablesController.getTablesList,
  )
  .post(validate({ body: CreateTableSchema }), tablesController.createTable);

router
  .route("/:id")
  .get(validate({ params: IdInParamsSchema }), tablesController.getTableById)
  .patch(
    validate({ params: IdInParamsSchema, body: UpdateTableSchema }),
    tablesController.updateTable,
  );

router.get(
  "/:id/qr",
  validate({ params: IdInParamsSchema }),
  tablesController.getQrImage,
);

export default router;
