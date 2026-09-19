import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as interactionController from "../controllers/interaction.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(interactionController.list));
router.post("/", asyncHandler(interactionController.create));
router.put("/:id", asyncHandler(interactionController.update));

export default router;
