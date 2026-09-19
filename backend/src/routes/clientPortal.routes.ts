import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireClientAuth } from "../middlewares/clientPortalAuth.middleware";
import * as clientPortalController from "../controllers/clientPortal.controller";

const router = Router();

router.post("/login", asyncHandler(clientPortalController.login));
router.get("/me", requireClientAuth, asyncHandler(clientPortalController.me));

export default router;
