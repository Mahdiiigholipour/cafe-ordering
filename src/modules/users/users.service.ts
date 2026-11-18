import { UserRoles } from "../../common/enums/user-roles.enum";
import { ConflictError, NotFoundError } from "../../common/errors";
import { hashPassword } from "../../common/utils/password.util";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./schemas/create-user.schema";
import { ResetPasswordDto } from "./schemas/reset-password.schema";
import { UpdateUserDto } from "./schemas/update-user.schema";
import { UsersResponse } from "./types/users-response.interface";
import { UsersMessages } from "./users.messages";
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
    return users.map(this.toResponse);
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

    return this.toResponse(user);
  }

  async getById(id: string) {
    const user = await this.getEntityOrThrow(id);
    return this.toResponse(user);
  }

  async update(actingUserId: string, targetId: string, data: UpdateUserDto) {
    const targetUser = await this.getEntityOrThrow(targetId);
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

    return this.toResponse(updated);
  }

  async countActiveAdmins() {
    return this.usersRepo.findActiveAdmins();
  }

  async resetPassword(targetId: string, data: ResetPasswordDto) {
    const user = await this.getEntityOrThrow(targetId);
    const hashed = await hashPassword(data.password);

    const updated = await this.usersRepo.update(user, { password: hashed });

    return this.toResponse(updated);
  }

  private toResponse(user: Omit<UserEntity, "password">): UsersResponse {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  private async getEntityOrThrow(id: string) {
    const entity = await this.usersRepo.findById(id);
    if (!entity) throw new NotFoundError(UsersMessages.USER_NOT_FOUND);

    return entity;
  }
}
