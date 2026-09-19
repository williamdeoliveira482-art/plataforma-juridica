import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as taskController from "../controllers/task.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(taskController.list));
router.post("/", asyncHandler(taskController.create));
router.put("/:id", asyncHandler(taskController.update));
router.delete("/:id", asyncHandler(taskController.remove));

export default router;
