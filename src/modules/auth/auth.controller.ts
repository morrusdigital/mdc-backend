import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../shared/http/response";
import { GetCurrentAdminProfileUseCase } from "./use-cases/get-current-admin-profile.use-case";
import { LoginAdminUseCase } from "./use-cases/login-admin.use-case";
import { LogoutAdminUseCase } from "./use-cases/logout-admin.use-case";
import { RefreshAdminTokenUseCase } from "./use-cases/refresh-admin-token.use-case";

const loginAdminUseCase = new LoginAdminUseCase();
const refreshAdminTokenUseCase = new RefreshAdminTokenUseCase();
const logoutAdminUseCase = new LogoutAdminUseCase();
const getCurrentAdminProfileUseCase = new GetCurrentAdminProfileUseCase();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginAdminUseCase.execute(req.body.email, req.body.password);

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
    const result = await refreshAdminTokenUseCase.execute(req.body.refreshToken);

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
    await logoutAdminUseCase.execute(req.authUser!.sessionId);

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
    const profile = await getCurrentAdminProfileUseCase.execute(req.authUser!.id);

    sendSuccess(res, 200, "Current admin profile retrieved", profile);
  } catch (error) {
    next(error);
  }
};
