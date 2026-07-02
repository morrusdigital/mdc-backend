import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error intercepted by middleware:", err);

  const status =
    err instanceof AppError ? err.statusCode : err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(err instanceof AppError && err.details !== undefined && { details: err.details }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
