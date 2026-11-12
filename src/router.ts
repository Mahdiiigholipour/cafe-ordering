import { Router } from "express";
import AuthRouter from "./modules/auth/auth.routes";
import UsersRouter from "./modules/users/users.routes";

export const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/users", UsersRouter);
