import { UserEntity } from "./entities/user.entity";
import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepo.findByUsername(username);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findById(id);
  }
}
