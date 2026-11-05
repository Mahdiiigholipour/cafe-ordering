import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async findByUsername(username: string) {
    return this.userRepo.findByUsername(username);
  }
}
