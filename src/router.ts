import { Router } from "express";
import { authenticate } from "./modules/auth";
import AuthRouter from "./modules/auth/auth.routes";
import CategoriesRouter from "./modules/categories/categories.routes";
import UsersRouter from "./modules/users/users.routes";

export const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/users", authenticate, UsersRouter);
AppRouter.use("/categories", authenticate, CategoriesRouter);
