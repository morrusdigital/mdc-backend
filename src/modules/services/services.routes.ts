import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  createService,
  createServiceCategory,
  deleteService,
  deleteServiceCategory,
  getServiceById,
  listServiceCategories,
  listServices,
  updateService,
  updateServiceCategory,
} from "./services.controller";
import {
  createServiceCategorySchema,
  createServiceSchema,
  serviceCategoryIdParamsSchema,
  serviceIdParamsSchema,
  updateServiceCategorySchema,
  updateServiceSchema,
} from "./services.schemas";

const router = Router();

router.use(requireAuth());

router.get("/service-categories", requirePermission("services.read"), listServiceCategories);
router.post(
  "/service-categories",
  requirePermission("services.create"),
  validateRequest(createServiceCategorySchema),
  createServiceCategory
);
router.patch(
  "/service-categories/:id",
  requirePermission("services.update"),
  validateRequest(updateServiceCategorySchema),
  updateServiceCategory
);
router.delete(
  "/service-categories/:id",
  requirePermission("services.delete"),
  validateRequest(serviceCategoryIdParamsSchema),
  deleteServiceCategory
);

router.get("/services", requirePermission("services.read"), listServices);
router.get(
  "/services/:id",
  requirePermission("services.read"),
  validateRequest(serviceIdParamsSchema),
  getServiceById
);
router.post(
  "/services",
  requirePermission("services.create"),
  validateRequest(createServiceSchema),
  createService
);
router.patch(
  "/services/:id",
  requirePermission("services.update"),
  validateRequest(updateServiceSchema),
  updateService
);
router.delete(
  "/services/:id",
  requirePermission("services.delete"),
  validateRequest(serviceIdParamsSchema),
  deleteService
);

export default router;
