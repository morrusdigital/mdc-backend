import { Router } from "express";
import { validateRequest } from "../../shared/validation/validate";
import { requireAuth } from "../../shared/middleware/auth.middleware";
import { login, logout, me, refresh } from "./auth.controller";
import { loginSchema, refreshTokenSchema } from "./auth.schemas";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", validateRequest(refreshTokenSchema), refresh);
router.post("/logout", requireAuth(), logout);
router.get("/me", requireAuth(), me);

export default router;
