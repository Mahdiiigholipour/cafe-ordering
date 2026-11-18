import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import env from "../../config/env";
import { UploadsMessages } from "../constants/uploads.messages";
import {
  AppError,
  BadRequestError,
  ErrorCodes,
  HttpStatusCodes,
  PayloadTooLargeError,
  ValidationError,
} from "../errors";
import { mapDatabaseError } from "../errors/database-error.mapper";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(err);

  const originalError = err;
  let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let code = ErrorCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let details;

  // Handle zod validator's errors
  if (err instanceof ZodError) {
    err = new ValidationError(
      "Invalid input",
      err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    );
  }

  // Handle malformed json errors
  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    err = new BadRequestError("Invalid JSON body");
  }

  // Handle MySQL errors
  const databaseError = mapDatabaseError(err);
  if (databaseError) err = databaseError;

  // Handle Multer errors
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE")
      err = new PayloadTooLargeError(UploadsMessages.FILE_TOO_LARGE);

    err = new BadRequestError(UploadsMessages.UPLOAD_FAILED);
  }

  // Handle http errors
  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;

    if (err.code === ErrorCodes.VALIDATION_ERROR && "details" in err)
      details = err.details;
  } else {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      ...(env.NODE_ENV === "development" && { stack: originalError.stack }),
    },
  });
}
