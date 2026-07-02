import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  approveCaseStudy,
  archiveCaseStudy,
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudyById,
  getPublicCaseStudyBySlug,
  listCaseStudies,
  listPublicCaseStudies,
  publishCaseStudy,
  scheduleCaseStudy,
  submitCaseStudyReview,
  updateCaseStudy,
} from "./case-studies.controller";
import {
  caseStudyIdParamsSchema,
  caseStudySlugParamsSchema,
  createCaseStudySchema,
  publicCaseStudiesQuerySchema,
  scheduleCaseStudySchema,
  updateCaseStudySchema,
  updateCaseStudyWorkflowParamsSchema,
} from "./case-studies.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get("/case-studies", requirePermission("case_studies.read"), listCaseStudies);
adminRouter.get(
  "/case-studies/:id",
  requirePermission("case_studies.read"),
  validateRequest(caseStudyIdParamsSchema),
  getCaseStudyById
);
adminRouter.post(
  "/case-studies",
  requirePermission("case_studies.create"),
  validateRequest(createCaseStudySchema),
  createCaseStudy
);
adminRouter.patch(
  "/case-studies/:id",
  requirePermission("case_studies.update"),
  validateRequest(updateCaseStudySchema),
  updateCaseStudy
);
adminRouter.delete(
  "/case-studies/:id",
  requirePermission("case_studies.delete"),
  validateRequest(caseStudyIdParamsSchema),
  deleteCaseStudy
);
adminRouter.post(
  "/case-studies/:id/submit-review",
  requirePermission("case_studies.submit_review"),
  validateRequest(updateCaseStudyWorkflowParamsSchema),
  submitCaseStudyReview
);
adminRouter.post(
  "/case-studies/:id/approve",
  requirePermission("case_studies.approve"),
  validateRequest(updateCaseStudyWorkflowParamsSchema),
  approveCaseStudy
);
adminRouter.post(
  "/case-studies/:id/publish",
  requirePermission("case_studies.publish"),
  validateRequest(updateCaseStudyWorkflowParamsSchema),
  publishCaseStudy
);
adminRouter.post(
  "/case-studies/:id/schedule",
  requirePermission("case_studies.publish"),
  validateRequest(scheduleCaseStudySchema),
  scheduleCaseStudy
);
adminRouter.post(
  "/case-studies/:id/archive",
  requirePermission("case_studies.archive"),
  validateRequest(updateCaseStudyWorkflowParamsSchema),
  archiveCaseStudy
);

publicRouter.get(
  "/case-studies",
  validateRequest(publicCaseStudiesQuerySchema),
  listPublicCaseStudies
);
publicRouter.get(
  "/case-studies/:slug",
  validateRequest(caseStudySlugParamsSchema),
  getPublicCaseStudyBySlug
);

export { adminRouter as caseStudiesAdminRoutes, publicRouter as caseStudiesPublicRoutes };
