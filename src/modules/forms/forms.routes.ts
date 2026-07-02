import { Router } from "express";
import { formsFoundation, submitLeadForm } from "./forms.controller";
import { validateRequest } from "../../shared/validation/validate";
import { publicLeadSubmitSchema } from "../leads/leads.schemas";

const router = Router();

router.get("/", formsFoundation);
router.post("/leads", validateRequest(publicLeadSubmitSchema), submitLeadForm);

export default router;
