import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as processController from "../controllers/process.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(processController.list));
router.get("/:id", asyncHandler(processController.getById));
router.post("/", asyncHandler(processController.create));
router.put("/:id", asyncHandler(processController.update));
router.delete("/:id", asyncHandler(processController.remove));

export default router;
