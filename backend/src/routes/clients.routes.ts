import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import * as clientController from "../controllers/client.controller";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(clientController.list));
router.get("/:id", asyncHandler(clientController.getById));
router.post("/", asyncHandler(clientController.create));
router.put("/:id", asyncHandler(clientController.update));
router.delete("/:id", asyncHandler(clientController.remove));

export default router;
