import { NextFunction, Request, Response } from "express";
import env from "../../config/env";
import { AppError, ErrorCodes, HttpStatusCodes } from "../errors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(err);

  let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let code = ErrorCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}
