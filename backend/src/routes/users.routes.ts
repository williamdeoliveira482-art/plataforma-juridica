import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/permission.middleware";
import * as userController from "../controllers/user.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(userController.list));
router.post("/", requireRole("ADMIN"), asyncHandler(userController.create));
router.put("/:id", requireRole("ADMIN"), asyncHandler(userController.update));
router.delete("/:id", requireRole("ADMIN"), asyncHandler(userController.remove));

export default router;
