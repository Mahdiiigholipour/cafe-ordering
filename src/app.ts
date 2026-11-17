import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./common/middlewares/error-handler.middleware";
import { notFoundHandler } from "./common/middlewares/not-found.middleware";
import env from "./config/env";
import { AppRouter } from "./router";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use("/uploads", express.static(env.UPLOADS_DIR));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", AppRouter);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
