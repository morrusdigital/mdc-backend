import { Router } from "express";
import { dbTest, home } from "../controllers/home.controller";

const router = Router();

router.get("/", home);
router.get("/db-test", dbTest);

export default router;