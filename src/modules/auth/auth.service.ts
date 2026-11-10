import { DUMMY_PASSWORD_HASH } from "../../common/constants/dummy-password-hash.const";
import { UnauthorizedError } from "../../common/errors";
import { comparePassword } from "../../common/utils/password.util";
import { signAccessToken } from "../../common/utils/token.util";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./schemas/login.schema";

export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login({ password, username }: LoginDto) {
    const user = await this.usersService.findByUsername(username);
    const hash = user?.password ?? DUMMY_PASSWORD_HASH;
    const ok = await comparePassword(password, hash);
    if (!user || !ok || !user.isActive)
      throw new UnauthorizedError("Username or password is incorrect.");

    return {
      accessToken: signAccessToken(user.id),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        fullName: user.fullName,
      },
    };
  }
}
