import { Router } from "express";
import {
  getProjectBySlug,
  getProjects,
} from "../controllers/project.controller";

const router = Router();

router.get("/portfolio", getProjects);
router.get("/portfolio/:slug", getProjectBySlug);

export default router;
