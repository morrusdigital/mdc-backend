import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../shared/http/response";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);

    sendSuccess(res, 200, "Admin login successful", result);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);

    sendSuccess(res, 200, "Token refreshed successfully", result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.logout(req.authUser!.sessionId);

    sendSuccess(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await authService.me(req.authUser!.id);

    sendSuccess(res, 200, "Current admin profile retrieved", profile);
  } catch (error) {
    next(error);
  }
};
