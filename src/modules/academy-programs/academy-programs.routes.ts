import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import {
  createAcademyProgram,
  deleteAcademyProgram,
  getAcademyProgramById,
  getPublicAcademyProgramBySlug,
  getPublicAcademyTrackBySlug,
  listAcademyPrograms,
  listPublicAcademyPrograms,
  updateAcademyProgram,
} from "./academy-programs.controller";
import {
  academyProgramIdParamsSchema,
  academyProgramSlugParamsSchema,
  academyProgramTrackParamsSchema,
  createAcademyProgramSchema,
  publicAcademyProgramsQuerySchema,
  updateAcademyProgramSchema,
} from "./academy-programs.schemas";

export const academyProgramsAdminRoutes = Router();

academyProgramsAdminRoutes.use(requireAuth());
academyProgramsAdminRoutes.get("/academy-programs", requirePermission("academy_programs.read"), listAcademyPrograms);
academyProgramsAdminRoutes.get(
  "/academy-programs/:id",
  requirePermission("academy_programs.read"),
  validateRequest(academyProgramIdParamsSchema),
  getAcademyProgramById
);
academyProgramsAdminRoutes.post(
  "/academy-programs",
  requirePermission("academy_programs.create"),
  validateRequest(createAcademyProgramSchema),
  createAcademyProgram
);
academyProgramsAdminRoutes.patch(
  "/academy-programs/:id",
  requirePermission("academy_programs.update"),
  validateRequest(updateAcademyProgramSchema),
  updateAcademyProgram
);
academyProgramsAdminRoutes.delete(
  "/academy-programs/:id",
  requirePermission("academy_programs.delete"),
  validateRequest(academyProgramIdParamsSchema),
  deleteAcademyProgram
);

export const academyProgramsPublicRoutes = Router();

academyProgramsPublicRoutes.get(
  "/academy-programs",
  validateRequest(publicAcademyProgramsQuerySchema),
  listPublicAcademyPrograms
);
academyProgramsPublicRoutes.get(
  "/academy-programs/:slug",
  validateRequest(academyProgramSlugParamsSchema),
  getPublicAcademyProgramBySlug
);
academyProgramsPublicRoutes.get(
  "/academy-programs/:programSlug/tracks/:trackSlug",
  validateRequest(academyProgramTrackParamsSchema),
  getPublicAcademyTrackBySlug
);
