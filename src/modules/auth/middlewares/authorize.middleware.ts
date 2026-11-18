import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../../../common/enums/user-roles.enum";
import { ForbiddenError, UnauthorizedError } from "../../../common/errors";
import { AuthMessages } from "../auth.messages";

export function getAuthUser(req: Request) {
  const { user } = req;
  if (!user) throw new UnauthorizedError(AuthMessages.AUTHENTICATION_REQUIRED);
  return user;
}

export function authorize(...roles: UserRoles[]) {
  const allowedRoles = new Set<UserRoles>([UserRoles.Admin, ...roles]);

  return async (req: Request, _res: Response, next: NextFunction) => {
    const user = getAuthUser(req);

    if (!allowedRoles.has(user.role))
      throw new ForbiddenError(AuthMessages.PERMISSION_DENIED);

    next();
  };
}
