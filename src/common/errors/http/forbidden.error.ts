import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HttpStatusCodes.FORBIDDEN, ErrorCodes.FORBIDDEN);
  }
}
