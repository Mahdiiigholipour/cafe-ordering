import { UserRoles } from "../../../common/enums/user-roles.enum";

export interface UsersResponse {
  id: string;
  username: string;
  fullName: string;
  role: UserRoles;
  isActive: boolean;
  createdAt: Date;
}
