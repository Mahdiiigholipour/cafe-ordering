import { Router } from "express";
import { authenticate, authService } from ".";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { validate } from "../../common/middlewares/validate.middleware";
import { AuthController } from "./auth.controller";
import { LoginRateLimiter } from "./login-rate-limiter";
import { authorize } from "./middlewares/authorize.middleware";
import { LoginSchema } from "./schemas/login.schema";

const router = Router();
const authController = new AuthController(authService);

router.post(
  "/login",
  LoginRateLimiter,
  validate({ body: LoginSchema }),
  authController.login,
);

router.get(
  "/me",
  authenticate,
  authorize(UserRoles.Staff),
  authController.getMe,
);

export default router;
