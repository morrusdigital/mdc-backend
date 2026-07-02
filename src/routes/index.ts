import { Router } from "express";
import { dbTest, home } from "../controllers/home.controller";
import adminRoutes from "./admin.routes";
import publicRoutes from "./public.routes";
import formsRoutes from "./forms.routes";

const router = Router();

router.get("/", home);
router.get("/db-test", dbTest);
router.use("/api/admin", adminRoutes);
router.use("/api/public", publicRoutes);
router.use("/api/forms", formsRoutes);

export default router;
