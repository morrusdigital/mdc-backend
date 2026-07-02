import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  createPage,
  deletePage,
  getPageById,
  listPages,
  publishPage,
  replacePageSections,
  updatePage,
} from "./pages.controller";
import {
  createPageSchema,
  pageIdParamsSchema,
  publishPageSchema,
  replacePageSectionsSchema,
  updatePageSchema,
} from "./pages.schemas";

const router = Router();

router.use(requireAuth());

router.get("/", requirePermission("pages.read"), listPages);
router.get("/:id", requirePermission("pages.read"), validateRequest(pageIdParamsSchema), getPageById);
router.post("/", requirePermission("pages.create"), validateRequest(createPageSchema), createPage);
router.patch("/:id", requirePermission("pages.update"), validateRequest(updatePageSchema), updatePage);
router.delete("/:id", requirePermission("pages.delete"), validateRequest(pageIdParamsSchema), deletePage);
router.put(
  "/:id/sections",
  requirePermission("pages.update"),
  validateRequest(replacePageSectionsSchema),
  replacePageSections
);
router.patch(
  "/:id/publish",
  requirePermission("pages.publish"),
  validateRequest(publishPageSchema),
  publishPage
);

export default router;
