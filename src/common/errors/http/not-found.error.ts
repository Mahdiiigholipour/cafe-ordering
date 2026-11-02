import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HttpStatusCodes.NOT_FOUND, ErrorCodes.NOT_FOUND, true);
  }
}
