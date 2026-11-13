import z from "zod";
import { UsersMessages } from "../../../common/enums/messages/users.messages";
import { UserRoles } from "../../../common/enums/user-roles.enum";
import { PasswordSchema } from "./password-schema";

export const CreateUserSchema = z
  .object({
    fullName: z.string().trim().min(2).max(50),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, UsersMessages.USERNAME_REQUIRED)
      .max(32, UsersMessages.USERNAME_MAX_LENGTH)
      .regex(/^[a-z0-9_.]+$/, UsersMessages.USERNAME_INVALID_FORMAT),

    password: PasswordSchema,
    role: z.enum(UserRoles),
  })
  .strict();

export type CreateUserDto = z.output<typeof CreateUserSchema>;
