import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  listNotificationSettings,
  upsertNotificationSetting,
} from "./notifications.controller";
import {
  updateNotificationSettingSchema,
} from "./notifications.schemas";

const router = Router();

router.use(requireAuth());

router.get(
  "/notification-settings",
  requirePermission("notifications.read"),
  listNotificationSettings
);
router.put(
  "/notification-settings/:channel/:event",
  requirePermission("notifications.update"),
  validateRequest(updateNotificationSettingSchema),
  upsertNotificationSetting
);

export default router;
