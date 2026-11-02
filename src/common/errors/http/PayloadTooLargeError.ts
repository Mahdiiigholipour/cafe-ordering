import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class PayloadTooLargeError extends AppError {
  constructor(message = "Payload too large") {
    super(
      message,
      HttpStatusCodes.PAYLOAD_TOO_LARGE,
      ErrorCodes.PAYLOAD_TOO_LARGE,
    );
  }
}
