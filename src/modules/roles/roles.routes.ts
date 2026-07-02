import { Router } from "express";
import {
  requireAuth,
  requirePermission,
} from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  assignRolePermissions,
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
} from "./roles.controller";
import {
  assignRolePermissionsSchema,
  createRoleSchema,
  roleIdParamsSchema,
  updateRoleSchema,
} from "./roles.schemas";

const router = Router();

router.use(requireAuth());

router.get("/", requirePermission("roles.read"), listRoles);
router.get(
  "/:id",
  requirePermission("roles.read"),
  validateRequest(roleIdParamsSchema),
  getRoleById
);
router.post(
  "/",
  requirePermission("roles.create"),
  validateRequest(createRoleSchema),
  createRole
);
router.patch(
  "/:id",
  requirePermission("roles.update"),
  validateRequest(updateRoleSchema),
  updateRole
);
router.delete(
  "/:id",
  requirePermission("roles.delete"),
  validateRequest(roleIdParamsSchema),
  deleteRole
);
router.put(
  "/:id/permissions",
  requirePermission("roles.assign_permission"),
  validateRequest(assignRolePermissionsSchema),
  assignRolePermissions
);

export default router;
