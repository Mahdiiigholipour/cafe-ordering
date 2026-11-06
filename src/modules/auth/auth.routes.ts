import { Router } from "express";
import { authenticate, authService } from ".";
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

router.get("/me", authenticate, authController.getMe);

export default router;
