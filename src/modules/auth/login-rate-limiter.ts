import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../../common/errors";
import { AuthMessages } from "./auth.messages";

export const LoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError(AuthMessages.LOGIN_RATE_LIMIT_EXCEEDED));
  },
});
