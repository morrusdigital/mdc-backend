import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { GetNavigationMenuByIdUseCase } from "./use-cases/get-navigation-menu-by-id.use-case";
import { GetPublicNavigationByCodeUseCase } from "./use-cases/get-public-navigation-by-code.use-case";
import { ListNavigationMenusUseCase } from "./use-cases/list-navigation-menus.use-case";
import { ReplaceNavigationItemsUseCase } from "./use-cases/replace-navigation-items.use-case";
import { UpdateNavigationMenuUseCase } from "./use-cases/update-navigation-menu.use-case";

const listNavigationMenusUseCase = new ListNavigationMenusUseCase();
const getNavigationMenuByIdUseCase = new GetNavigationMenuByIdUseCase();
const updateNavigationMenuUseCase = new UpdateNavigationMenuUseCase();
const replaceNavigationItemsUseCase = new ReplaceNavigationItemsUseCase();
const getPublicNavigationByCodeUseCase = new GetPublicNavigationByCodeUseCase();

const getId = (req: Request) => String(req.params.id);
const getCode = (req: Request) => String(req.params.code);

export const listNavigationMenus = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await listNavigationMenusUseCase.execute();
    sendSuccess(res, 200, "Navigation menus retrieved successfully", menus);
  } catch (error) {
    next(error);
  }
};

export const getNavigationMenuById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await getNavigationMenuByIdUseCase.execute(getId(req));
    sendSuccess(res, 200, "Navigation menu retrieved successfully", menu);
  } catch (error) {
    next(error);
  }
};

export const updateNavigationMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await updateNavigationMenuUseCase.execute(getId(req), req.body);
    sendSuccess(res, 200, "Navigation menu updated successfully", menu);
  } catch (error) {
    next(error);
  }
};

export const replaceNavigationItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await replaceNavigationItemsUseCase.execute(getId(req), req.body.items);
    sendSuccess(res, 200, "Navigation items updated successfully", menu);
  } catch (error) {
    next(error);
  }
};

export const getPublicNavigationByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await getPublicNavigationByCodeUseCase.execute(getCode(req));
    sendSuccess(res, 200, "Navigation menu retrieved successfully", menu);
  } catch (error) {
    next(error);
  }
};
