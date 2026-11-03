import path from "node:path";
import { DataSource } from "typeorm";
import env from "../config/env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  charset: "utf8mb4",
  synchronize: false,
  entities: [path.join(__dirname, "../modules/**/*.entity.{js,ts}")],
  migrations: [path.join(__dirname, "migrations/*.{js,ts}")],
});
