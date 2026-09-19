import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/permission.middleware";
import * as financialController from "../controllers/financial.controller";

const router = Router();
router.use(requireAuth);

router.get("/summary", asyncHandler(financialController.summary));
router.get("/", asyncHandler(financialController.list));
router.post("/", requireRole("ADMIN", "FINANCE"), asyncHandler(financialController.create));
router.put("/:id", requireRole("ADMIN", "FINANCE"), asyncHandler(financialController.update));
router.delete("/:id", requireRole("ADMIN", "FINANCE"), asyncHandler(financialController.remove));
router.post("/:id/pay", requireRole("ADMIN", "FINANCE"), asyncHandler(financialController.pay));

export default router;
