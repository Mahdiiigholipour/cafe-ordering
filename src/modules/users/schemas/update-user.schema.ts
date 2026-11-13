import z from "zod";
import { UsersMessages } from "../../../common/enums/messages/users.messages";
import { UserRoles } from "../../../common/enums/user-roles.enum";

export const UpdateUserSchema = z
  .object({
    role: z.enum(UserRoles).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (d) => d.role !== undefined || d.isActive !== undefined,
    UsersMessages.UPDATE_EMPTY,
  );

export type UpdateUserDto = z.output<typeof UpdateUserSchema>;
