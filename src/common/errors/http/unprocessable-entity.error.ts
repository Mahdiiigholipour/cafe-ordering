import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable entity") {
    super(
      message,
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
      ErrorCodes.UNPROCESSABLE_ENTITY,
    );
  }
}
