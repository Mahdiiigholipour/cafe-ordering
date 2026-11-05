import { usersService } from "../users";
import { AuthService } from "./auth.service";

export const authService = new AuthService(usersService);
