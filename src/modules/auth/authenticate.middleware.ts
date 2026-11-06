import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors";
import { verifyAccessToken } from "../../common/utils/token.util";
import { UsersService } from "../users/users.service";

const BEARER_REGEX = /^Bearer\s+(\S+)$/i;
const AUTH_REQUIRED_MESSAGE = "Authentication required.";
export function createAuthenticate(usersService: UsersService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const match = BEARER_REGEX.exec(req.headers.authorization ?? "");

    if (!match) throw new UnauthorizedError("Authentication required.");

    const { sub } = verifyAccessToken(match[1]);

    const user = await usersService.findById(sub);
    if (!user || !user.isActive)
      throw new UnauthorizedError("Authentication required.");

    req.user = { id: user.id, role: user.role, username: user.username };
    next();
  };
}
