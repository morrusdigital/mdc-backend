import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  addLeadNote,
  assignLead,
  exportLeads,
  getLeadById,
  listLeads,
  submitPublicLead,
  updateLead,
  updateLeadStatus,
} from "./leads.controller";
import {
  addLeadNoteSchema,
  assignLeadSchema,
  leadIdParamsSchema,
  listLeadsQuerySchema,
  publicLeadSubmitSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from "./leads.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get(
  "/leads/export",
  requirePermission("leads.export"),
  validateRequest(listLeadsQuerySchema),
  exportLeads
);
adminRouter.get(
  "/leads",
  requirePermission("leads.read"),
  validateRequest(listLeadsQuerySchema),
  listLeads
);
adminRouter.get(
  "/leads/:id",
  requirePermission("leads.read"),
  validateRequest(leadIdParamsSchema),
  getLeadById
);
adminRouter.patch(
  "/leads/:id",
  requirePermission("leads.update"),
  validateRequest(updateLeadSchema),
  updateLead
);
adminRouter.patch(
  "/leads/:id/status",
  requirePermission("leads.update"),
  validateRequest(updateLeadStatusSchema),
  updateLeadStatus
);
adminRouter.post(
  "/leads/:id/assignments",
  requirePermission("leads.assign"),
  validateRequest(assignLeadSchema),
  assignLead
);
adminRouter.post(
  "/leads/:id/notes",
  requirePermission("leads.note"),
  validateRequest(addLeadNoteSchema),
  addLeadNote
);

publicRouter.post("/leads", validateRequest(publicLeadSubmitSchema), submitPublicLead);

export { adminRouter as leadsAdminRoutes, publicRouter as leadsPublicRoutes };
