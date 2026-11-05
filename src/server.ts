import http from "http";
import "reflect-metadata";
import app from "./app";
import env from "./config/env";
import { AppDataSource } from "./database/data-source";

let isShuttingDown = false;
async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected.");

    const server = http.createServer(app);

    server.once("error", (err) => {
      console.error("Server error", err);
      process.exit(1);
    });

    process.on("SIGINT", () => shutdown("SIGINT", server));
    process.on("SIGTERM", () => shutdown("SIGTERM", server));

    server.listen(env.PORT, () => {
      console.log(`Server running at: http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

function shutdown(signal: string, server: http.Server) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received. Starting graceful shutdown...`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  server.close(async (closeErr) => {
    if (closeErr) {
      console.error("Failed to close HTTP server:", closeErr);
      process.exit(1);
    }

    try {
      if (AppDataSource.isInitialized) await AppDataSource.destroy();
      console.log("Database connection closed.");
      console.log("Application shut down successfully.");
      process.exit(0);
    } catch (dbErr) {
      console.error("Failed to close database connection:", dbErr);
      process.exit(1);
    }
  });

  server.closeIdleConnections();
}

bootstrap();
