import { Router } from "express";
import { validateRequest } from "../shared/validation/validate";
import {
  getProjectBySlug,
  listProjects,
} from "../modules/projects/projects.controller";
import { projectSlugParamsSchema } from "../modules/projects/projects.schemas";

const router = Router();

router.get("/portfolio", listProjects);
router.get(
  "/portfolio/:slug",
  validateRequest(projectSlugParamsSchema),
  getProjectBySlug
);

export default router;
