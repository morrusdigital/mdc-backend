import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  getNavigationMenuById,
  listNavigationMenus,
  replaceNavigationItems,
  updateNavigationMenu,
} from "./navigation.controller";
import {
  navigationMenuIdParamsSchema,
  replaceNavigationItemsSchema,
  updateNavigationMenuSchema,
} from "./navigation.schemas";

const router = Router();

router.use(requireAuth());

router.get("/menus", requirePermission("navigation.read"), listNavigationMenus);
router.get(
  "/menus/:id",
  requirePermission("navigation.read"),
  validateRequest(navigationMenuIdParamsSchema),
  getNavigationMenuById
);
router.patch(
  "/menus/:id",
  requirePermission("navigation.update"),
  validateRequest(updateNavigationMenuSchema),
  updateNavigationMenu
);
router.put(
  "/menus/:id/items",
  requirePermission("navigation.update"),
  validateRequest(replaceNavigationItemsSchema),
  replaceNavigationItems
);

export default router;
