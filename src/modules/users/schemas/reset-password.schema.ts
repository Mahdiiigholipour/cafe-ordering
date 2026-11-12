import z from "zod";
import { UsersMessages } from "../../../common/enums/messages/users.messages";
import { isValidBcryptPassword } from "../../../common/utils/password.util";

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, UsersMessages.PASSWORD_MIN)
    .refine(isValidBcryptPassword, UsersMessages.PASSWORD_MAX),
});

export type ResetPasswordDto = z.output<typeof ResetPasswordSchema>;
