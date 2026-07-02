import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { ValidationError } from "../errors/app-error";

type RequestSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

const formatZodIssues = (error: ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
};

export const validateRequest =
  (schemas: RequestSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError("Validation failed", formatZodIssues(error)));
        return;
      }

      next(error);
    }
  };
