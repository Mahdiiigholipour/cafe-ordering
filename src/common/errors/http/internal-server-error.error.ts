import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(
      message,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      false,
    );
  }
}
