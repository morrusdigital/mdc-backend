import { Router } from "express";
import { requireAuth, requirePermission } from "../../shared/middleware/auth.middleware";
import { validateRequest } from "../../shared/validation/validate";
import * as controller from "./industries.controller";
import * as schemas from "./industries.schemas";

export const publicIndustriesRoutes = Router();
publicIndustriesRoutes.get("/industries", controller.listPublicIndustries);
publicIndustriesRoutes.get("/industries/:slug", validateRequest(schemas.industrySlugParamsSchema), controller.getPublicIndustry);

export const adminIndustriesRoutes = Router();
adminIndustriesRoutes.use(requireAuth());
adminIndustriesRoutes.get("/industries", requirePermission("industries.read"), controller.listIndustries);
adminIndustriesRoutes.post("/industries", requirePermission("industries.create"), validateRequest(schemas.createIndustrySchema), controller.createIndustry);
adminIndustriesRoutes.patch("/industries/:id", requirePermission("industries.update"), validateRequest(schemas.updateIndustrySchema), controller.updateIndustry);
adminIndustriesRoutes.delete("/industries/:id", requirePermission("industries.delete"), validateRequest(schemas.industryIdParamsSchema), controller.deleteIndustry);
adminIndustriesRoutes.post("/industries/:industryId/solutions", requirePermission("industries.update"), validateRequest(schemas.createSolutionSchema), controller.createSolution);
adminIndustriesRoutes.patch("/industries/:industryId/solutions/:solutionId", requirePermission("industries.update"), validateRequest(schemas.updateSolutionSchema), controller.updateSolution);
adminIndustriesRoutes.delete("/industries/:industryId/solutions/:solutionId", requirePermission("industries.update"), validateRequest(schemas.industrySolutionParamsSchema), controller.deleteSolution);
