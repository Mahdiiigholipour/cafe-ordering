import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ErrorHandler } from "./common/middlewares/error-handler.middleware";
import { NotFoundHandler } from "./common/middlewares/not-found.middleware";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handlers
app.use(NotFoundHandler);
app.use(ErrorHandler);

export default app;
