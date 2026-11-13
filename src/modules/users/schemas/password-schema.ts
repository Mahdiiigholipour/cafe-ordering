import z from "zod";
import { UsersMessages } from "../../../common/enums/messages/users.messages";
import { isValidBcryptPassword } from "../../../common/utils/password.util";

export const PasswordSchema = z
  .string()
  .trim()
  .min(8, UsersMessages.PASSWORD_MIN_LENGTH)
  .refine(isValidBcryptPassword, UsersMessages.PASSWORD_MAX_LENGTH);
