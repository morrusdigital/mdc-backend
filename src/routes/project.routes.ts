import { Router } from "express";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

// Admin-only routes
router.post("/", adminAuthMiddleware, createProject);
router.put("/:id", adminAuthMiddleware, updateProject);
router.patch("/:id", adminAuthMiddleware, updateProject);
router.delete("/:id", adminAuthMiddleware, deleteProject);

export default router;
