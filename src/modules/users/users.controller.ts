import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { UsersService } from "./users.service";

const usersService = new UsersService();
const getId = (req: Request) => Number(req.params.id);

export const listUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await usersService.listUsers();

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
    const user = await usersService.getUserById(getId(req));

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
    const user = await usersService.createUser(req.body);

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
    const user = await usersService.updateUser(
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
    const user = await usersService.updateUserStatus(
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
    const user = await usersService.assignRoles(
      getId(req),
      req.body.roleIds
    );

    sendSuccess(res, 200, "User roles updated successfully", user);
  } catch (error) {
    next(error);
  }
};
