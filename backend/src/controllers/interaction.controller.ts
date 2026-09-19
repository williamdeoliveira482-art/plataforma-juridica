import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as interactionService from "../services/interaction.service";

export async function list(req: AuthenticatedRequest, res: Response) {
  res.json(await interactionService.listInteractions(req.user!.officeId));
}

export async function create(req: AuthenticatedRequest, res: Response) {
  res.status(201).json(await interactionService.createInteraction(req.user!.officeId, req.body));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  res.json(await interactionService.updateInteraction(req.params.id, req.user!.officeId, req.body));
}
