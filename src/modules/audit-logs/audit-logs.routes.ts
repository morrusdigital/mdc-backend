import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import { listAuditLogs } from "./audit-logs.controller";
import { listAuditLogsQuerySchema } from "./audit-logs.schemas";

const router = Router();

router.use(requireAuth());

router.get(
  "/audit-logs",
  requirePermission("audit_logs.read"),
  validateRequest(listAuditLogsQuerySchema),
  listAuditLogs
);

export default router;
