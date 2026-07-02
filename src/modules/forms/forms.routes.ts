import { Router } from "express";
import { formsFoundation } from "./forms.controller";

const router = Router();

router.get("/", formsFoundation);

export default router;
