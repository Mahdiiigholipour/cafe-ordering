import "reflect-metadata";
import { EntityManager } from "typeorm";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { hashPassword } from "../../common/utils/password.util";
import env from "../../config/env";
import { UserEntity } from "../../modules/users/entities/user.entity";

export async function seedAdmin(manager: EntityManager) {
  const userRepository = manager.getRepository(UserEntity);

  const adminUsername = env.ADMIN_USERNAME;
  const adminPassword = env.ADMIN_PASSWORD;

  const existingAdmin = await userRepository.existsBy({
    username: adminUsername,
  });
  if (existingAdmin) {
    console.log("Admin already exists, skipped.");
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  const admin = userRepository.create({
    fullName: "admin",
    username: adminUsername,
    password: hashedPassword,
    role: UserRoles.Admin,
  });

  await userRepository.save(admin);
  console.log("Admin created.");
}
