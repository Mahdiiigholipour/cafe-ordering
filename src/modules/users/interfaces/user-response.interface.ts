import { UserRoles } from "../../../common/enums/user-roles.enum";

export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  role: UserRoles;
  isActive: boolean;
  createdAt: Date;
}
