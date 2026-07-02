import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  approveTeamMember,
  archiveTeamMember,
  createTeamMember,
  deleteTeamMember,
  getPublicTeamMemberBySlug,
  getTeamMemberById,
  listPublicTeamMembers,
  listTeamMembers,
  publishTeamMember,
  scheduleTeamMember,
  submitTeamMemberReview,
  updateTeamMember,
} from "./team.controller";
import {
  createTeamMemberSchema,
  publicTeamMembersQuerySchema,
  scheduleTeamMemberSchema,
  teamMemberIdParamsSchema,
  teamMemberSlugParamsSchema,
  updateTeamMemberSchema,
  updateTeamWorkflowParamsSchema,
} from "./team.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get("/team-members", requirePermission("team.read"), listTeamMembers);
adminRouter.get(
  "/team-members/:id",
  requirePermission("team.read"),
  validateRequest(teamMemberIdParamsSchema),
  getTeamMemberById
);
adminRouter.post(
  "/team-members",
  requirePermission("team.create"),
  validateRequest(createTeamMemberSchema),
  createTeamMember
);
adminRouter.patch(
  "/team-members/:id",
  requirePermission("team.update"),
  validateRequest(updateTeamMemberSchema),
  updateTeamMember
);
adminRouter.delete(
  "/team-members/:id",
  requirePermission("team.delete"),
  validateRequest(teamMemberIdParamsSchema),
  deleteTeamMember
);
adminRouter.post(
  "/team-members/:id/submit-review",
  requirePermission("team.submit_review"),
  validateRequest(updateTeamWorkflowParamsSchema),
  submitTeamMemberReview
);
adminRouter.post(
  "/team-members/:id/approve",
  requirePermission("team.approve"),
  validateRequest(updateTeamWorkflowParamsSchema),
  approveTeamMember
);
adminRouter.post(
  "/team-members/:id/publish",
  requirePermission("team.publish"),
  validateRequest(updateTeamWorkflowParamsSchema),
  publishTeamMember
);
adminRouter.post(
  "/team-members/:id/schedule",
  requirePermission("team.publish"),
  validateRequest(scheduleTeamMemberSchema),
  scheduleTeamMember
);
adminRouter.post(
  "/team-members/:id/archive",
  requirePermission("team.archive"),
  validateRequest(updateTeamWorkflowParamsSchema),
  archiveTeamMember
);

publicRouter.get("/team-members", validateRequest(publicTeamMembersQuerySchema), listPublicTeamMembers);
publicRouter.get(
  "/team-members/:slug",
  validateRequest(teamMemberSlugParamsSchema),
  getPublicTeamMemberBySlug
);

export { adminRouter as teamAdminRoutes, publicRouter as teamPublicRoutes };
