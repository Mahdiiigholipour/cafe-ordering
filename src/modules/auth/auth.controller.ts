import { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors";
import { AuthMessages } from "./auth.messages";
import { AuthService } from "./auth.service";
import { LoginDto } from "./schemas/login.schema";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (_req: Request, res: Response) => {
    const body: LoginDto = res.locals.validatedBody;
    const data = await this.authService.login(body);

    return res.status(200).json({ success: true, data });
  };

  getMe = async (req: Request, res: Response) => {
    const { user } = req;
    if (!user)
      throw new UnauthorizedError(AuthMessages.AUTHENTICATION_REQUIRED);
    return res.status(200).json({ success: true, data: user });
  };
}
