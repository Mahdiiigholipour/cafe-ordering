import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./schemas/login.schema";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    const body: LoginDto = res.locals.validatedBody;
    const data = await this.authService.login(body);

    return res.status(200).json({ success: true, data });
  };
}
