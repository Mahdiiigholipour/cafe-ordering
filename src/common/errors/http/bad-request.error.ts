import { AppError } from "../app-error";
import { ErrorCodes } from "../types/error-codes.enum";
import { HttpStatusCodes } from "../types/http-status-codes.enum";

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, HttpStatusCodes.BAD_REQUEST, ErrorCodes.BAD_REQUEST);
  }
}
