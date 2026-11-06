import { UserRoles } from "../enums/user-roles.enum";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRoles;
}
