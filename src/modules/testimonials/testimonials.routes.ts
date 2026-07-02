import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  approveTestimonial,
  archiveTestimonial,
  createTestimonial,
  deleteTestimonial,
  getTestimonialById,
  listPublicTestimonials,
  listTestimonials,
  publishTestimonial,
  scheduleTestimonial,
  submitTestimonialReview,
  updateTestimonial,
} from "./testimonials.controller";
import {
  createTestimonialSchema,
  publicTestimonialsQuerySchema,
  scheduleTestimonialSchema,
  testimonialIdParamsSchema,
  updateTestimonialSchema,
  updateTestimonialWorkflowParamsSchema,
} from "./testimonials.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get("/testimonials", requirePermission("testimonials.read"), listTestimonials);
adminRouter.get(
  "/testimonials/:id",
  requirePermission("testimonials.read"),
  validateRequest(testimonialIdParamsSchema),
  getTestimonialById
);
adminRouter.post(
  "/testimonials",
  requirePermission("testimonials.create"),
  validateRequest(createTestimonialSchema),
  createTestimonial
);
adminRouter.patch(
  "/testimonials/:id",
  requirePermission("testimonials.update"),
  validateRequest(updateTestimonialSchema),
  updateTestimonial
);
adminRouter.delete(
  "/testimonials/:id",
  requirePermission("testimonials.delete"),
  validateRequest(testimonialIdParamsSchema),
  deleteTestimonial
);
adminRouter.post(
  "/testimonials/:id/submit-review",
  requirePermission("testimonials.submit_review"),
  validateRequest(updateTestimonialWorkflowParamsSchema),
  submitTestimonialReview
);
adminRouter.post(
  "/testimonials/:id/approve",
  requirePermission("testimonials.approve"),
  validateRequest(updateTestimonialWorkflowParamsSchema),
  approveTestimonial
);
adminRouter.post(
  "/testimonials/:id/publish",
  requirePermission("testimonials.publish"),
  validateRequest(updateTestimonialWorkflowParamsSchema),
  publishTestimonial
);
adminRouter.post(
  "/testimonials/:id/schedule",
  requirePermission("testimonials.publish"),
  validateRequest(scheduleTestimonialSchema),
  scheduleTestimonial
);
adminRouter.post(
  "/testimonials/:id/archive",
  requirePermission("testimonials.archive"),
  validateRequest(updateTestimonialWorkflowParamsSchema),
  archiveTestimonial
);

publicRouter.get(
  "/testimonials",
  validateRequest(publicTestimonialsQuerySchema),
  listPublicTestimonials
);

export { adminRouter as testimonialsAdminRoutes, publicRouter as testimonialsPublicRoutes };
