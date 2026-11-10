import { EntityManager } from "typeorm";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { hashPassword } from "../../common/utils/password.util";
import { UserEntity } from "../../modules/users/entities/user.entity";

export async function seedStaff(manager: EntityManager) {
  const userRepository = manager.getRepository(UserEntity);

  const staffUsername = "staff123";
  const staffPasswrod = "staff123";

  const existingStaff = await userRepository.existsBy({
    username: staffUsername,
  });
  if (existingStaff) {
    console.log("Staff already exists, skipped.");
    return;
  }

  const hashedPassword = await hashPassword(staffPasswrod);

  const staff = userRepository.create({
    fullName: "admin",
    username: staffUsername,
    password: hashedPassword,
    role: UserRoles.Staff,
  });

  await userRepository.save(staff);
  console.log("Staff created.");
}
