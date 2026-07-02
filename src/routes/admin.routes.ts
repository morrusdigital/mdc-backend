import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import rolesRoutes from "../modules/roles/roles.routes";
import permissionsRoutes from "../modules/permissions/permissions.routes";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../controllers/project.controller";
import {
  requireAuth,
  requirePermission,
} from "../shared/middleware/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolesRoutes);
router.use("/permissions", permissionsRoutes);

router.post(
  "/projects",
  requireAuth(),
  requirePermission("projects.create"),
  createProject
);
router.put(
  "/projects/:id",
  requireAuth(),
  requirePermission("projects.update"),
  updateProject
);
router.patch(
  "/projects/:id",
  requireAuth(),
  requirePermission("projects.update"),
  updateProject
);
router.delete(
  "/projects/:id",
  requireAuth(),
  requirePermission("projects.delete"),
  deleteProject
);

export default router;
