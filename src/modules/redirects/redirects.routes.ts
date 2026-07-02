import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  createRedirectRule,
  deleteRedirectRule,
  getRedirectRuleById,
  listRedirectRules,
  resolveRedirect,
  updateRedirectRule,
} from "./redirects.controller";
import {
  createRedirectRuleSchema,
  redirectIdParamsSchema,
  resolveRedirectQuerySchema,
  updateRedirectRuleSchema,
} from "./redirects.schemas";

const adminRouter = Router();
const publicRouter = Router();

adminRouter.use(requireAuth());

adminRouter.get("/redirects", requirePermission("redirects.read"), listRedirectRules);
adminRouter.get(
  "/redirects/:id",
  requirePermission("redirects.read"),
  validateRequest(redirectIdParamsSchema),
  getRedirectRuleById
);
adminRouter.post(
  "/redirects",
  requirePermission("redirects.create"),
  validateRequest(createRedirectRuleSchema),
  createRedirectRule
);
adminRouter.patch(
  "/redirects/:id",
  requirePermission("redirects.update"),
  validateRequest(updateRedirectRuleSchema),
  updateRedirectRule
);
adminRouter.delete(
  "/redirects/:id",
  requirePermission("redirects.delete"),
  validateRequest(redirectIdParamsSchema),
  deleteRedirectRule
);

publicRouter.get(
  "/redirects/resolve",
  validateRequest(resolveRedirectQuerySchema),
  resolveRedirect
);

export { adminRouter as redirectsAdminRoutes, publicRouter as redirectsPublicRoutes };
