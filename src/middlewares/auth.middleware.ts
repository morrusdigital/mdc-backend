import { Request, Response, NextFunction } from "express";

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_SECRET || "supersecretadmintoken";

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Missing Authorization header",
    });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid authorization header format",
    });
    return;
  }

  const [type, token] = parts;
  if (type !== "Bearer" || token !== adminSecret) {
    res.status(403).json({
      success: false,
      message: "Forbidden: Invalid admin token",
    });
    return;
  }

  next();
};
