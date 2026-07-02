import { Router } from "express";
import {
  requireAuth,
  requirePermission,
} from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  assignUserRoles,
  createUser,
  getUserById,
  listUsers,
  updateUser,
  updateUserStatus,
} from "./users.controller";
import {
  assignUserRolesSchema,
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  userIdParamsSchema,
} from "./users.schemas";

const router = Router();

router.use(requireAuth());

router.get("/", requirePermission("users.read"), listUsers);
router.get(
  "/:id",
  requirePermission("users.read"),
  validateRequest(userIdParamsSchema),
  getUserById
);
router.post(
  "/",
  requirePermission("users.create"),
  validateRequest(createUserSchema),
  createUser
);
router.patch(
  "/:id",
  requirePermission("users.update"),
  validateRequest(updateUserSchema),
  updateUser
);
router.patch(
  "/:id/status",
  validateRequest(updateUserStatusSchema),
  (req, _res, next) => {
    const permission = req.body.isActive ? "users.activate" : "users.deactivate";
    return requirePermission(permission)(req, _res, next);
  },
  updateUserStatus
);
router.put(
  "/:id/roles",
  requirePermission("users.assign_role"),
  validateRequest(assignUserRolesSchema),
  assignUserRoles
);

export default router;
