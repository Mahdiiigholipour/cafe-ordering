import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

export class UsersRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }
}
