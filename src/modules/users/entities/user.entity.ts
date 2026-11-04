import { Column, Entity } from "typeorm";
import { AppBaseEntity } from "../../../common/entities/base.entity";
import { UserRoles } from "../../../common/enums/user-roles.enum";

@Entity("users")
export class UserEntity extends AppBaseEntity {
  @Column({ type: "varchar", length: 100 })
  fullName!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.Staff })
  role!: UserRoles;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
