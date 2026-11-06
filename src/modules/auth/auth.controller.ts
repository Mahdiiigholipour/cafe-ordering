import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors";
import { AuthService } from "./auth.service";
import { LoginDto } from "./schemas/login.schema";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    const body: LoginDto = res.locals.validatedBody;
    const data = await this.authService.login(body);

    return res.status(200).json({ success: true, data });
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user) throw new UnauthorizedError("Authentication required.");
    return res.status(200).json({ success: true, data: user });
  };
}
