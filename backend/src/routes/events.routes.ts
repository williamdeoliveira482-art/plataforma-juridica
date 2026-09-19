import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as eventController from "../controllers/event.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(eventController.list));
router.post("/", asyncHandler(eventController.create));
router.put("/:id", asyncHandler(eventController.update));
router.delete("/:id", asyncHandler(eventController.remove));

export default router;
