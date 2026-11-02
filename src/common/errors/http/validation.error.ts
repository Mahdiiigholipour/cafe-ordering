import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class ValidationError extends AppError {
  constructor(
    message = "Invalid input",
    public readonly details?: { field: string; message: string }[],
  ) {
    super(
      message,
      HttpStatusCodes.BAD_REQUEST,
      ErrorCodes.VALIDATION_ERROR,
      true,
    );
  }
}
