import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, HttpStatusCodes.CONFLICT, ErrorCodes.CONFLICT);
  }
}
