import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class UnsupportedMediaTypeError extends AppError {
  constructor(message = "Unsupported media type") {
    super(
      message,
      HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE,
      ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
    );
  }
}
