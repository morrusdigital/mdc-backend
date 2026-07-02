import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  approveFaqItem,
  archiveFaqItem,
  createFaqCategory,
  createFaqItem,
  deleteFaqCategory,
  deleteFaqItem,
  getFaqItemById,
  listFaqCategories,
  listFaqItems,
  listPublicFaqs,
  publishFaqItem,
  scheduleFaqItem,
  submitFaqItemReview,
  updateFaqCategory,
  updateFaqItem,
} from "./faqs.controller";
import {
  createFaqCategorySchema,
  createFaqItemSchema,
  faqCategoryIdParamsSchema,
  faqItemIdParamsSchema,
  publicFaqsQuerySchema,
  scheduleFaqItemSchema,
  updateFaqCategorySchema,
  updateFaqItemSchema,
  updateFaqWorkflowParamsSchema,
} from "./faqs.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get("/faq-categories", requirePermission("faq.read"), listFaqCategories);
adminRouter.post(
  "/faq-categories",
  requirePermission("faq.create"),
  validateRequest(createFaqCategorySchema),
  createFaqCategory
);
adminRouter.patch(
  "/faq-categories/:id",
  requirePermission("faq.update"),
  validateRequest(updateFaqCategorySchema),
  updateFaqCategory
);
adminRouter.delete(
  "/faq-categories/:id",
  requirePermission("faq.delete"),
  validateRequest(faqCategoryIdParamsSchema),
  deleteFaqCategory
);

adminRouter.get("/faq-items", requirePermission("faq.read"), listFaqItems);
adminRouter.get(
  "/faq-items/:id",
  requirePermission("faq.read"),
  validateRequest(faqItemIdParamsSchema),
  getFaqItemById
);
adminRouter.post(
  "/faq-items",
  requirePermission("faq.create"),
  validateRequest(createFaqItemSchema),
  createFaqItem
);
adminRouter.patch(
  "/faq-items/:id",
  requirePermission("faq.update"),
  validateRequest(updateFaqItemSchema),
  updateFaqItem
);
adminRouter.delete(
  "/faq-items/:id",
  requirePermission("faq.delete"),
  validateRequest(faqItemIdParamsSchema),
  deleteFaqItem
);
adminRouter.post(
  "/faq-items/:id/submit-review",
  requirePermission("faq.submit_review"),
  validateRequest(updateFaqWorkflowParamsSchema),
  submitFaqItemReview
);
adminRouter.post(
  "/faq-items/:id/approve",
  requirePermission("faq.approve"),
  validateRequest(updateFaqWorkflowParamsSchema),
  approveFaqItem
);
adminRouter.post(
  "/faq-items/:id/publish",
  requirePermission("faq.publish"),
  validateRequest(updateFaqWorkflowParamsSchema),
  publishFaqItem
);
adminRouter.post(
  "/faq-items/:id/schedule",
  requirePermission("faq.publish"),
  validateRequest(scheduleFaqItemSchema),
  scheduleFaqItem
);
adminRouter.post(
  "/faq-items/:id/archive",
  requirePermission("faq.archive"),
  validateRequest(updateFaqWorkflowParamsSchema),
  archiveFaqItem
);

publicRouter.get("/faqs", validateRequest(publicFaqsQuerySchema), listPublicFaqs);

export { adminRouter as faqsAdminRoutes, publicRouter as faqsPublicRoutes };
