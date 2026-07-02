import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  getSettingsGroup,
  listSiteSettings,
  upsertSettingsGroup,
} from "./settings.controller";
import {
  settingsGroupParamsSchema,
  upsertSettingsGroupSchema,
} from "./settings.schemas";

const router = Router();

router.use(requireAuth());

router.get("/", requirePermission("settings.read"), listSiteSettings);
router.get(
  "/:group",
  requirePermission("settings.read"),
  validateRequest(settingsGroupParamsSchema),
  getSettingsGroup
);
router.put(
  "/:group",
  requirePermission("settings.update"),
  validateRequest(upsertSettingsGroupSchema),
  upsertSettingsGroup
);

export default router;
