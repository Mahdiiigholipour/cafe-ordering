import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service unavailable") {
    super(
      message,
      HttpStatusCodes.SERVICE_UNAVAILABLE,
      ErrorCodes.SERVICE_UNAVAILABLE,
    );
  }
}
