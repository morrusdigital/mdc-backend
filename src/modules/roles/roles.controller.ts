import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { AssignPermissionsToRoleUseCase } from "./use-cases/assign-permissions-to-role.use-case";
import { CreateRoleUseCase } from "./use-cases/create-role.use-case";
import { DeleteRoleUseCase } from "./use-cases/delete-role.use-case";
import { GetRoleByIdUseCase } from "./use-cases/get-role-by-id.use-case";
import { ListRolesUseCase } from "./use-cases/list-roles.use-case";
import { UpdateRoleUseCase } from "./use-cases/update-role.use-case";

const listRolesUseCase = new ListRolesUseCase();
const getRoleByIdUseCase = new GetRoleByIdUseCase();
const createRoleUseCase = new CreateRoleUseCase();
const updateRoleUseCase = new UpdateRoleUseCase();
const deleteRoleUseCase = new DeleteRoleUseCase();
const assignPermissionsToRoleUseCase = new AssignPermissionsToRoleUseCase();
const getId = (req: Request) => Number(req.params.id);

export const listRoles = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await listRolesUseCase.execute();

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
    const role = await getRoleByIdUseCase.execute(getId(req));

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
    const role = await createRoleUseCase.execute(req.body);

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
    const role = await updateRoleUseCase.execute(
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
    await deleteRoleUseCase.execute(getId(req));

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
    const role = await assignPermissionsToRoleUseCase.execute(
      getId(req),
      req.body.permissionIds
    );

    sendSuccess(res, 200, "Role permissions updated successfully", role);
  } catch (error) {
    next(error);
  }
};
