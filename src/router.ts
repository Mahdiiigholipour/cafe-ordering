import { Router } from "express";
import AuthRouter from "./modules/auth/auth.routes";

export const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
