import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as dashboardController from "../controllers/dashboard.controller";

const router = Router();
router.use(requireAuth);

router.get("/summary", asyncHandler(dashboardController.summary));
router.get("/charts", asyncHandler(dashboardController.charts));

export default router;
