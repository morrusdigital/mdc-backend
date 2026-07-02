import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { ListPermissionsUseCase } from "./use-cases/list-permissions.use-case";

const listPermissionsUseCase = new ListPermissionsUseCase();

export const listPermissions = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await listPermissionsUseCase.execute();

    sendSuccess(res, 200, "Permissions retrieved successfully", permissions);
  } catch (error) {
    next(error);
  }
};
