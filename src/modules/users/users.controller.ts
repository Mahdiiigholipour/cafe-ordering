import { Request, Response } from "express";
import { IdInParamsDto } from "../../common/validations/id-in-params.schema";
import { getAuthUser } from "../auth/middlewares/authorize.middleware";
import { CreateUserDto } from "./schemas/create-user.schema";
import { ResetPasswordDto } from "./schemas/reset-password.schema";
import { UpdateUserDto } from "./schemas/update-user.schema";
import { UsersMessages } from "./users.messages";
import { UsersService } from "./users.service";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getUsersList = async (_req: Request, res: Response) => {
    const users = await this.usersService.list();

    return res.status(200).json({ success: true, data: users });
  };

  createUser = async (_req: Request, res: Response) => {
    const dto: CreateUserDto = res.locals.validatedBody;

    const user = await this.usersService.create(dto);

    return res
      .status(201)
      .json({ success: true, message: UsersMessages.USER_CREATED, data: user });
  };

  getUserById = async (_req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;

    const user = await this.usersService.getById(params.id);

    return res.status(200).json({ success: true, data: user });
  };

  updateUser = async (_req: Request, res: Response) => {
    const actingUser = getAuthUser(_req);
    const body: UpdateUserDto = res.locals.validatedBody;
    const params: IdInParamsDto = res.locals.validatedParams;

    const user = await this.usersService.update(actingUser.id, params.id, body);

    return res.status(200).json({
      success: true,
      message: UsersMessages.USER_UPDATED,
      data: user,
    });
  };

  resetPassword = async (_req: Request, res: Response) => {
    const body: ResetPasswordDto = res.locals.validatedBody;
    const params: IdInParamsDto = res.locals.validatedParams;

    const user = await this.usersService.resetPassword(params.id, body);

    return res.status(200).json({
      success: true,
      message: UsersMessages.USER_PASSWORD_UPDATED,
      data: user,
    });
  };
}
