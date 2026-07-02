import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { PermissionsService } from "./permissions.service";

const permissionsService = new PermissionsService();

export const listPermissions = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await permissionsService.listPermissions();

    sendSuccess(res, 200, "Permissions retrieved successfully", permissions);
  } catch (error) {
    next(error);
  }
};
