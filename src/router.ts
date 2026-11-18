import { Router } from "express";
import AuthRouter from "./modules/auth/auth.routes";
import CategoriesRouter from "./modules/categories/categories.routes";
import ProductOptionsRouter from "./modules/product-options/product-options.routes";
import ProductsRouter from "./modules/products/products.routes";
import SettingsRouter from "./modules/settings/settings.routes";
import TablesRouter from "./modules/tables/tables.routes";
import UsersRouter from "./modules/users/users.routes";

export const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/users", UsersRouter);
AppRouter.use("/categories", CategoriesRouter);
AppRouter.use("/products/:productId/options", ProductOptionsRouter);
AppRouter.use("/products", ProductsRouter);
AppRouter.use("/tables", TablesRouter);
AppRouter.use("/settings", SettingsRouter);
