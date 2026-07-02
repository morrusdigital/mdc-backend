import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { AssignRolesToUserUseCase } from "./use-cases/assign-roles-to-user.use-case";
import { CreateUserUseCase } from "./use-cases/create-user.use-case";
import { GetUserByIdUseCase } from "./use-cases/get-user-by-id.use-case";
import { ListUsersUseCase } from "./use-cases/list-users.use-case";
import { UpdateUserStatusUseCase } from "./use-cases/update-user-status.use-case";
import { UpdateUserUseCase } from "./use-cases/update-user.use-case";

const listUsersUseCase = new ListUsersUseCase();
const getUserByIdUseCase = new GetUserByIdUseCase();
const createUserUseCase = new CreateUserUseCase();
const updateUserUseCase = new UpdateUserUseCase();
const updateUserStatusUseCase = new UpdateUserStatusUseCase();
const assignRolesToUserUseCase = new AssignRolesToUserUseCase();
const getId = (req: Request) => Number(req.params.id);

export const listUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await listUsersUseCase.execute();

    sendSuccess(res, 200, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByIdUseCase.execute(getId(req));

    sendSuccess(res, 200, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUserUseCase.execute(req.body);

    sendSuccess(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await updateUserUseCase.execute(
      getId(req),
      req.body
    );

    sendSuccess(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await updateUserStatusUseCase.execute(
      getId(req),
      req.body.isActive
    );

    sendSuccess(res, 200, "User status updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const assignUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await assignRolesToUserUseCase.execute(
      getId(req),
      req.body.roleIds
    );

    sendSuccess(res, 200, "User roles updated successfully", user);
  } catch (error) {
    next(error);
  }
};
