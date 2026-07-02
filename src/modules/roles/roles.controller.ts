import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { RolesService } from "./roles.service";

const rolesService = new RolesService();
const getId = (req: Request) => Number(req.params.id);

export const listRoles = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await rolesService.listRoles();

    sendSuccess(res, 200, "Roles retrieved successfully", roles);
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await rolesService.getRoleById(getId(req));

    sendSuccess(res, 200, "Role retrieved successfully", role);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await rolesService.createRole(req.body);

    sendSuccess(res, 201, "Role created successfully", role);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await rolesService.updateRole(
      getId(req),
      req.body
    );

    sendSuccess(res, 200, "Role updated successfully", role);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await rolesService.deleteRole(getId(req));

    sendSuccess(res, 200, "Role deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const assignRolePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await rolesService.assignPermissions(
      getId(req),
      req.body.permissionIds
    );

    sendSuccess(res, 200, "Role permissions updated successfully", role);
  } catch (error) {
    next(error);
  }
};
