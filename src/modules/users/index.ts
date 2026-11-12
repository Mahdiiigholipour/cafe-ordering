import { AppDataSource } from "../../database/data-source";
import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

const usersRepository = new UsersRepository(
  AppDataSource.getRepository(UserEntity),
);

export const usersService = new UsersService(usersRepository);
