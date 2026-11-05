import { Router } from "express";
import { authService } from ".";
import { validate } from "../../common/middlewares/validate.middleware";
import { AuthController } from "./auth.controller";
import { LoginRateLimiter } from "./login-rate-limiter";
import { LoginSchema } from "./schemas/login.schema";

const router = Router();

const authController = new AuthController(authService);

router.post(
  "/login",
  LoginRateLimiter,
  validate({ body: LoginSchema }),
  authController.login,
);

export default router;
