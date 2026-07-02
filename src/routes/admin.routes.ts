import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import rolesRoutes from "../modules/roles/roles.routes";
import permissionsRoutes from "../modules/permissions/permissions.routes";
import pagesRoutes from "../modules/pages/pages.routes";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../modules/projects/projects.controller";
import {
  createProjectSchema,
  patchProjectSchema,
  putProjectSchema,
  projectIdParamsSchema,
} from "../modules/projects/projects.schemas";
import servicesRoutes from "../modules/services/services.routes";
import navigationRoutes from "../modules/navigation/navigation.routes";
import settingsRoutes from "../modules/settings/settings.routes";
import { blogsAdminRoutes } from "../modules/blogs/blogs.routes";
import {
  caseStudiesAdminRoutes,
} from "../modules/case-studies/case-studies.routes";
import {
  testimonialsAdminRoutes,
} from "../modules/testimonials/testimonials.routes";
import { teamAdminRoutes } from "../modules/team/team.routes";
import { faqsAdminRoutes } from "../modules/faqs/faqs.routes";
import { redirectsAdminRoutes } from "../modules/redirects/redirects.routes";
import {
  requireAuth,
  requirePermission,
} from "../shared/middleware/auth.middleware";
import { validateRequest } from "../shared/validation/validate";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolesRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/pages", pagesRoutes);
router.use("/", servicesRoutes);
router.use("/navigation", navigationRoutes);
router.use("/settings", settingsRoutes);
router.use("/", blogsAdminRoutes);
router.use("/", caseStudiesAdminRoutes);
router.use("/", testimonialsAdminRoutes);
router.use("/", teamAdminRoutes);
router.use("/", faqsAdminRoutes);
router.use("/", redirectsAdminRoutes);

router.post(
  "/projects",
  requireAuth(),
  requirePermission("projects.create"),
  validateRequest(createProjectSchema),
  createProject
);
router.put(
  "/projects/:id",
  requireAuth(),
  requirePermission("projects.update"),
  validateRequest(putProjectSchema),
  updateProject
);
router.patch(
  "/projects/:id",
  requireAuth(),
  requirePermission("projects.update"),
  validateRequest(patchProjectSchema),
  updateProject
);
router.delete(
  "/projects/:id",
  requireAuth(),
  requirePermission("projects.delete"),
  validateRequest(projectIdParamsSchema),
  deleteProject
);

export default router;
