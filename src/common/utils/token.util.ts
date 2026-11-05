import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";
import env from "../../config/env";
import { UnauthorizedError } from "../errors";

export interface AccessTokenPayload {
  sub: string;
}
export function signAccessToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
    subject: userId,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  let payload: string | JwtPayload;

  try {
    payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError)
      throw new UnauthorizedError("Invalid token.");

    throw err;
  }

  if (typeof payload === "string" || typeof payload.sub !== "string")
    throw new UnauthorizedError("Invalid token payload");

  return { sub: payload.sub };
}
