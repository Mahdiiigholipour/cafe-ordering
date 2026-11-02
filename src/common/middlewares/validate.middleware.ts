import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";

type ValidationSchema = Partial<Record<"body" | "params" | "query", z.ZodType>>;

export function validate(schema: ValidationSchema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (schema.body) {
      res.locals.validated.body = await schema.body.parseAsync(req.body);
    }

    if (schema.params) {
      res.locals.validated.params = await schema.params.parseAsync(req.params);
    }

    if (schema.query) {
      res.locals.validated.query = await schema.query.parseAsync(req.query);
    }

    next();
  };
}
