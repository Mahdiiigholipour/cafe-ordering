import z from "zod";
import { UserRoles } from "../../../common/enums/user-roles.enum";

export const UpdateUserSchema = z.object({
  role: z.enum(UserRoles).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type UpdateUserDto = z.output<typeof UpdateUserSchema>;
