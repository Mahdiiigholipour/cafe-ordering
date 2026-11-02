import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors";

export function NotFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next(new NotFoundError("Route not found!"));
}
