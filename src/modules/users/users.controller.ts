import { NextFunction, Request, Response } from "express";
import { UsersMessages } from "../../common/enums/messages/users.messages";
import { IdInParamsDto } from "../../common/validations/id-in-params.schema";
import { getAuthUser } from "../auth/middlewares/authorize.middleware";
import { CreateUserDto } from "./schemas/create-user.schema";
import { ResetPasswordDto } from "./schemas/reset-password.schema";
import { UpdateUserDto } from "./schemas/update-user.schema";
import { UsersService } from "./users.service";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getUsersList = async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.usersService.list();

    return res.status(200).json({ success: true, data: users });
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const dto: CreateUserDto = res.locals.validatedBody;

    const user = await this.usersService.create(dto);

    return res
      .status(201)
      .json({ success: true, message: UsersMessages.USER_CREATED, data: user });
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const params: IdInParamsDto = res.locals.validatedParams;

    const user = await this.usersService.getById(params.id);

    return res.status(200).json({ success: true, data: user });
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const actingUser = getAuthUser(req);
    const body: UpdateUserDto = res.locals.validatedBody;
    const params: IdInParamsDto = res.locals.validatedParams;

    const user = await this.usersService.update(actingUser.id, params.id, body);

    return res.status(200).json({
      success: true,
      message: UsersMessages.USER_UPDATED,
      data: user,
    });
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const body: ResetPasswordDto = res.locals.validatedBody;
    const params: IdInParamsDto = res.locals.validatedParams;

    const user = await this.usersService.resetPassword(params.id, body);

    return res
      .status(200)
      .json({
        success: true,
        message: UsersMessages.USER_PASSWORD_UPDATED,
        data: user,
      });
  };
}
