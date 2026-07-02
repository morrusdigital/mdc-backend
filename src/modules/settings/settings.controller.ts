import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { GetSettingsGroupUseCase } from "./use-cases/get-settings-group.use-case";
import { ListSiteSettingsUseCase } from "./use-cases/list-site-settings.use-case";
import { UpsertSettingsGroupUseCase } from "./use-cases/upsert-settings-group.use-case";

const listSiteSettingsUseCase = new ListSiteSettingsUseCase();
const getSettingsGroupUseCase = new GetSettingsGroupUseCase();
const upsertSettingsGroupUseCase = new UpsertSettingsGroupUseCase();

const getGroup = (req: Request) => String(req.params.group);

export const listSiteSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await listSiteSettingsUseCase.execute();
    sendSuccess(res, 200, "Site settings retrieved successfully", settings);
  } catch (error) {
    next(error);
  }
};

export const getSettingsGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await getSettingsGroupUseCase.execute(getGroup(req));
    sendSuccess(res, 200, "Site setting group retrieved successfully", settings);
  } catch (error) {
    next(error);
  }
};

export const upsertSettingsGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await upsertSettingsGroupUseCase.execute(getGroup(req), req.body.items);
    sendSuccess(res, 200, "Site setting group updated successfully", settings);
  } catch (error) {
    next(error);
  }
};
