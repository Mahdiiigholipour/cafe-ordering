import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests") {
    super(
      message,
      HttpStatusCodes.TOO_MANY_REQUESTS,
      ErrorCodes.TOO_MANY_REQUESTS,
    );
  }
}
