import { Repository } from "typeorm";
import { UserRoles } from "../../common/enums/user-roles.enum";
import { UserEntity } from "./entities/user.entity";

export class UsersRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findByUsername(username: string) {
    return this.repository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async findAll() {
    return this.repository.find({ order: { createdAt: "ASC" } });
  }

  async create(
    data: Pick<UserEntity, "username" | "password" | "role" | "fullName">,
  ) {
    const user = this.repository.create(data);
    await this.repository.save(user);

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async update(user: UserEntity, data: Partial<UserEntity>) {
    if (data.isActive !== undefined) user.isActive = data.isActive;
    if (data.role !== undefined) user.role = data.role;
    if (data.password !== undefined) user.password = data.password;

    return this.repository.save(user);
  }

  async findActiveAdmins() {
    return this.repository.countBy({
      role: UserRoles.Admin,
      isActive: true,
    });
  }
}
