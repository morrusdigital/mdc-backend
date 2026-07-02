import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { getDashboardSummary } from "./dashboard.controller";

const router = Router();

router.use(requireAuth());

router.get("/dashboard/summary", requirePermission("dashboard.read"), getDashboardSummary);

export default router;
