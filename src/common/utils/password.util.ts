import bcrypt from "bcrypt";

export const MAX_BCRYPT_PASSWORD_BYTES = 72;

export function isValidBcryptPassword(password: string): boolean {
  return Buffer.byteLength(password, "utf8") <= MAX_BCRYPT_PASSWORD_BYTES;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
