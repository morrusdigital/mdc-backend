import { Router } from "express";
import { dbTest, home } from "../controllers/home.controller";
import projectRoutes from "./project.routes";

const router = Router();

router.get("/", home);
router.get("/db-test", dbTest);
router.use("/api/portfolio", projectRoutes);

export default router;