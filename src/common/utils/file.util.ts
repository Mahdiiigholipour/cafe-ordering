import { unlink } from "node:fs/promises";
import path from "node:path";
import env from "../../config/env";
import { InternalServerError } from "../errors";

export async function deleteUploadedFile(
  relativePath?: string | null,
): Promise<void> {
  if (!relativePath) return;

  const absolutePath = path.resolve(env.UPLOADS_DIR, relativePath);

  const normalizedRelative = path.relative(env.UPLOADS_DIR, absolutePath);

  if (
    !normalizedRelative ||
    normalizedRelative.startsWith(`..${path.sep}`) ||
    normalizedRelative === ".." ||
    path.isAbsolute(normalizedRelative)
  )
    throw new InternalServerError("Invalid upload file path.");

  try {
    await unlink(absolutePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;

    throw err;
  }
}
