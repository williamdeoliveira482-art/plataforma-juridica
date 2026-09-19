import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as aiController from "../controllers/ai.controller";

const router = Router();
router.use(requireAuth);

router.post("/assist", asyncHandler(aiController.assist));
router.get("/history", asyncHandler(aiController.history));

export default router;
