import z from "zod";
import { isValidBcryptPassword } from "../../../common/utils/password.util";
import { UsersMessages } from "../users.messages";

export const PasswordSchema = z
  .string()
  .trim()
  .min(8, UsersMessages.PASSWORD_MIN_LENGTH)
  .refine(isValidBcryptPassword, UsersMessages.PASSWORD_MAX_LENGTH);
