import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors";

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next(new NotFoundError(`Not found route: ${req.url}`));
}
