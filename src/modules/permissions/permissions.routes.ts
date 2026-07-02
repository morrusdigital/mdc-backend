import { Router } from "express";
import {
  requireAuth,
  requirePermission,
} from "../../shared/middleware/auth.middleware";
import { listPermissions } from "./permissions.controller";

const router = Router();

router.use(requireAuth());
router.get("/", requirePermission("permissions.read"), listPermissions);

export default router;
