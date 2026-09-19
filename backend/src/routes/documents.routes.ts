import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../lib/upload";
import * as documentController from "../controllers/document.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(documentController.list));
router.get("/categories", asyncHandler(documentController.categories));
router.post("/", upload.single("file"), asyncHandler(documentController.upload));
router.get("/:id/download", asyncHandler(documentController.download));
router.delete("/:id", asyncHandler(documentController.remove));

export default router;
