import z from "zod";
import { UsersMessages } from "../../../common/enums/messages/users.messages";
import { UserRoles } from "../../../common/enums/user-roles.enum";
import { isValidBcryptPassword } from "../../../common/utils/password.util";

export const CreateUserSchema = z.object({
  fullName: z.string().min(5).max(50).optional().default("user"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, UsersMessages.USERNAME_REQUIRED)
    .max(32, UsersMessages.USERNAME_MAX)
    .regex(/^[a-z0-9_.]+$/, UsersMessages.USERNAME_ALLOWED_CHARS),

  password: z
    .string()
    .trim()
    .min(8, UsersMessages.PASSWORD_MIN)
    .refine(isValidBcryptPassword, UsersMessages.PASSWORD_MAX),

  role: z.enum(UserRoles),
});

export type CreateUserDto = z.output<typeof CreateUserSchema>;
