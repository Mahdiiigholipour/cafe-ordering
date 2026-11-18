import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import env from "../../config/env";
import { UploadsMessages } from "../constants/uploads.messages";
import { UnsupportedMediaTypeError } from "../errors";

export const UPLOADS_DIR = env.UPLOADS_DIR;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

type UploadModule = "categories" | "products" | "settings";

export function createImageUpload(module: UploadModule) {
  const destination = path.join(UPLOADS_DIR, module);

  // Ensure destination directory exists
  mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destination),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const filename = `${randomUUID()}${extension}`;

      cb(null, filename);
    },
  });

  return multer({
    storage,
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
        return cb(
          new UnsupportedMediaTypeError(UploadsMessages.INVALID_MIME_TYPES),
        );

      cb(null, true);
    },

    limits: { fileSize: MAX_FILE_SIZE },
  });
}
