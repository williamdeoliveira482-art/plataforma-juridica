import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as aiService from "../services/ai.service";

export async function assist(req: AuthenticatedRequest, res: Response) {
  const { kind, prompt, clientId, processId } = req.body;
  const result = await aiService.requestAIAssistance({
    officeId: req.user!.officeId,
    userId: req.user!.id,
    clientId,
    processId,
    kind,
    prompt,
  });
  res.json(result);
}

export async function history(req: AuthenticatedRequest, res: Response) {
  res.json(await aiService.listAIInteractions(req.user!.officeId));
}
