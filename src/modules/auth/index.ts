import { usersService } from "../users";
import { AuthService } from "./auth.service";
import { createAuthenticate } from "./authenticate.middleware";

export const authService = new AuthService(usersService);
export const authenticate = createAuthenticate(usersService);
