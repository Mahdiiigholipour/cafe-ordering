import { Router } from "express";
import { usersService } from ".";
import { validate } from "../../common/middlewares/validate.middleware";
import { IdInParamsSchema } from "../../common/validations/id-in-params.schema";
import { authenticate } from "../auth";
import { authorize } from "../auth/middlewares/authorize.middleware";
import { CreateUserSchema } from "./schemas/create-user.schema";
import { ResetPasswordSchema } from "./schemas/reset-password.schema";
import { UpdateUserSchema } from "./schemas/update-user.schema";
import { UsersController } from "./users.controller";

const router = Router();
const usersController = new UsersController(usersService);

router.use(authenticate, authorize());

router
  .route("/")
  .get(usersController.getUsersList)
  .post(validate({ body: CreateUserSchema }), usersController.createUser);

router
  .route("/:id")
  .get(validate({ params: IdInParamsSchema }), usersController.getUserById)
  .patch(
    validate({ params: IdInParamsSchema, body: UpdateUserSchema }),
    usersController.updateUser,
  );

router.post(
  "/:id/reset-password",
  validate({ params: IdInParamsSchema, body: ResetPasswordSchema }),
  usersController.resetPassword,
);

export default router;
