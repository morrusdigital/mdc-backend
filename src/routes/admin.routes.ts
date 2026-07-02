import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import rolesRoutes from "../modules/roles/roles.routes";
import permissionsRoutes from "../modules/permissions/permissions.routes";
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
