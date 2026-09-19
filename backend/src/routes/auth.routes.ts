import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/login", asyncHandler(authController.login));
router.get("/me", requireAuth, asyncHandler(authController.me));
router.post("/logout", requireAuth, asyncHandler(authController.logout));

export default router;
