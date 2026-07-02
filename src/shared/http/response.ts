import { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
  meta?: unknown
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};
