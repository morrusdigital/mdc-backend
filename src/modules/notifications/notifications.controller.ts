import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  ListNotificationSettingsUseCase,
  UpsertNotificationSettingUseCase,
} from "./use-cases/notification-settings.use-cases";

const listNotificationSettingsUseCase = new ListNotificationSettingsUseCase();
const upsertNotificationSettingUseCase = new UpsertNotificationSettingUseCase();

export const listNotificationSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await listNotificationSettingsUseCase.execute();
    sendSuccess(res, 200, "Notification settings retrieved successfully", settings);
  } catch (error) {
    next(error);
  }
};

export const upsertNotificationSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const setting = await upsertNotificationSettingUseCase.execute(
      String(req.params.channel) as "email" | "webhook",
      String(req.params.event),
      req.body,
      {
        actorId: req.authUser!.id,
        ipAddress: req.ip ?? undefined,
        userAgent:
          typeof req.headers["user-agent"] === "string"
            ? req.headers["user-agent"]
            : undefined,
      }
    );
    sendSuccess(res, 200, "Notification setting updated successfully", setting);
  } catch (error) {
    next(error);
  }
};
