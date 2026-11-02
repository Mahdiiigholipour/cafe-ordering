import { ErrorCodes } from "./types/error-codes.enum";
import { HttpStatusCodes } from "./types/http-status-codes.enum";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCodes;
  public readonly code: ErrorCodes;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatusCodes,
    code: ErrorCodes,
    isOperational: boolean = true,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
