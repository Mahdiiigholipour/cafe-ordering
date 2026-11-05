import { QueryFailedError } from "typeorm";

import { AppError } from "./app-error";
import { BadRequestError } from "./http/bad-request.error";
import { ConflictError } from "./http/conflict.error";
import { ErrorCodes } from "./types/error-codes.enum";

interface MySqlDriverError {
  code: string;
}

function isMySqlDriverError(error: unknown): error is MySqlDriverError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

export function mapDatabaseError(error: unknown): AppError | null {
  if (!(error instanceof QueryFailedError)) {
    return null;
  }

  if (!isMySqlDriverError(error.driverError)) {
    return null;
  }

  switch (error.driverError.code) {
    case "ER_DUP_ENTRY":
      return new ConflictError(
        "A resource with this value already exists.",
        ErrorCodes.DUPLICATE_RESOURCE,
      );

    case "ER_ROW_IS_REFERENCED_2":
      return new ConflictError(
        "This resource is currently in use.",
        ErrorCodes.RESOURCE_IN_USE,
      );

    case "ER_NO_REFERENCED_ROW_2":
      return new BadRequestError(
        "The referenced resource does not exist.",
        ErrorCodes.INVALID_REFERENCE,
      );

    default:
      return null;
  }
}
