import { NextFunction, Request, Response } from "express";
import { AuthMessages } from "../../../common/enums/messages/auth.messages";
import { UserRoles } from "../../../common/enums/user-roles.enum";
import { ForbiddenError, UnauthorizedError } from "../../../common/errors";

export function getAuthUser(req: Request) {
  const { user } = req;
  if (!user) throw new UnauthorizedError(AuthMessages.AUTHENTICATION_REQUIRED);
  return user;
}

export function authorize(...roles: UserRoles[]) {
  const allowedRoles = new Set<UserRoles>([UserRoles.Admin, ...roles]);

  return async (req: Request, res: Response, next: NextFunction) => {
    const user = getAuthUser(req);

    if (!allowedRoles.has(user.role))
      throw new ForbiddenError(AuthMessages.ACCESS_DENIED);

    next();
  };
}
