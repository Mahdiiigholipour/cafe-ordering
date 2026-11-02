import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DB_HOST: z.string().trim().min(1, "DB_HOST is required"),
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  DB_USER: z.string().trim().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string().trim().min(1, "DB_NAME is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().trim().min(1, "JWT_EXPIRES_IN is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("\n[ENV ERROR] Invalid environment variables:\n");

  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  process.exit(1);
}

const env = Object.freeze(result.data);

export type Env = z.infer<typeof envSchema>;

export default env;
