import { UsersMessages } from "../../common/enums/messages/users.messages";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { ConflictError, NotFoundError } from "../../common/errors";
import { hashPassword } from "../../common/utils/password.util";
import { UserEntity } from "./entities/user.entity";
import { UserResponse } from "./interfaces/user-response.interface";
import { CreateUserDto } from "./schemas/create-user.schema";
import { ResetPasswordDto } from "./schemas/reset-password.schema";
import { UpdateUserDto } from "./schemas/update-user.schema";
import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  //------ Public helpers ------
  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.usersRepo.findByUsername(username);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepo.findById(id);
  }

  //------ Users' controller methods -------
  async list() {
    const users = await this.usersRepo.findAll();
    return users.map(this.toUserResponse);
  }

  async create(data: CreateUserDto) {
    let existUser = await this.findByUsername(data.username);
    if (existUser)
      throw new ConflictError(UsersMessages.USERNAME_ALREADY_EXISTS);

    const hashed = await hashPassword(data.password);
    const user = await this.usersRepo.create({
      username: data.username,
      password: hashed,
      role: data.role,
      fullName: data.fullName,
    });

    return this.toUserResponse(user);
  }

  async getById(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundError(UsersMessages.USER_NOT_FOUND);

    return this.toUserResponse(user);
  }

  async update(actingUserId: string, targetId: string, data: UpdateUserDto) {
    const targetUser = await this.findById(targetId);
    if (!targetUser) throw new NotFoundError(UsersMessages.USER_NOT_FOUND);

    const isDeactivating = targetUser.isActive && data.isActive === false;
    const isDemoting =
      targetUser.role === UserRoles.Admin &&
      data.role !== undefined &&
      data.role !== UserRoles.Admin;

    if (actingUserId === targetId && (isDeactivating || isDemoting))
      throw new ConflictError(UsersMessages.CANNOT_MODIFY_SELF);

    const removesActiveAdmin =
      targetUser.role === UserRoles.Admin &&
      targetUser.isActive &&
      (isDeactivating || isDemoting);

    if (removesActiveAdmin && (await this.countActiveAdmins()) <= 1)
      throw new ConflictError(UsersMessages.LAST_ADMIN_PROTECTED);

    const updated = await this.usersRepo.update(targetUser, data);

    return this.toUserResponse(updated);
  }

  async countActiveAdmins() {
    return this.usersRepo.findActiveAdmins();
  }

  async resetPassword(targetId: string, data: ResetPasswordDto) {
    const user = await this.findById(targetId);
    if (!user) throw new NotFoundError(UsersMessages.USER_NOT_FOUND);

    const hashed = await hashPassword(data.password);

    const updated = await this.usersRepo.update(user, { password: hashed });

    return this.toUserResponse(updated);
  }

  //------ Private helpers -------

  private toUserResponse(user: Omit<UserEntity, "password">): UserResponse {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
