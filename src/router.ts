import { Router } from "express";
import { authenticate } from "./modules/auth";
import AuthRouter from "./modules/auth/auth.routes";
import CategoriesRouter from "./modules/categories/categories.routes";
import ProductsRouter from "./modules/products/products.routes";
import TablesRouter from "./modules/tables/tables.routes";
import UsersRouter from "./modules/users/users.routes";

export const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/users", authenticate, UsersRouter);
AppRouter.use("/categories", authenticate, CategoriesRouter);
AppRouter.use("/products", authenticate, ProductsRouter);
AppRouter.use("/tables", authenticate, TablesRouter);
