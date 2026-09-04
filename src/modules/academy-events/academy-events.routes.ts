import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  createAcademyEvent,
  deleteAcademyEvent,
  getAcademyEventById,
  getPublicAcademyEventBySlug,
  listAcademyEvents,
  listPublicAcademyEvents,
  updateAcademyEvent,
} from "./academy-events.controller";
import {
  academyEventIdParamsSchema,
  academyEventSlugParamsSchema,
  createAcademyEventSchema,
  publicAcademyEventsQuerySchema,
  updateAcademyEventSchema,
} from "./academy-events.schemas";

export const academyEventsAdminRoutes = Router();

academyEventsAdminRoutes.use(requireAuth());
academyEventsAdminRoutes.get("/academy-events", requirePermission("academy_events.read"), listAcademyEvents);
academyEventsAdminRoutes.get(
  "/academy-events/:id",
  requirePermission("academy_events.read"),
  validateRequest(academyEventIdParamsSchema),
  getAcademyEventById
);
academyEventsAdminRoutes.post(
  "/academy-events",
  requirePermission("academy_events.create"),
  validateRequest(createAcademyEventSchema),
  createAcademyEvent
);
academyEventsAdminRoutes.patch(
  "/academy-events/:id",
  requirePermission("academy_events.update"),
  validateRequest(updateAcademyEventSchema),
  updateAcademyEvent
);
academyEventsAdminRoutes.delete(
  "/academy-events/:id",
  requirePermission("academy_events.delete"),
  validateRequest(academyEventIdParamsSchema),
  deleteAcademyEvent
);

export const academyEventsPublicRoutes = Router();

academyEventsPublicRoutes.get(
  "/academy-events",
  validateRequest(publicAcademyEventsQuerySchema),
  listPublicAcademyEvents
);
academyEventsPublicRoutes.get(
  "/academy-events/:slug",
  validateRequest(academyEventSlugParamsSchema),
  getPublicAcademyEventBySlug
);
