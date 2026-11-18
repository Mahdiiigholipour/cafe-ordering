import { UserEntity } from "../entities/user.entity";

export type CreateUserDataType = Pick<
  UserEntity,
  "username" | "password" | "role" | "fullName"
>;

export type UpdateUserDataType = Partial<
  Pick<UserEntity, "role" | "password" | "isActive">
>;
