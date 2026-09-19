import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { processSchema, processUpdateSchema } from "../validators/process.schema";
import * as processService from "../services/process.service";
import { AppError } from "../utils/AppError";

export async function list(req: AuthenticatedRequest, res: Response) {
  const status = req.query.status as string | undefined;
  res.json(await processService.listProcesses(req.user!.officeId, status));
}

export async function getById(req: AuthenticatedRequest, res: Response) {
  const process = await processService.getProcessById(req.params.id, req.user!.officeId);
  if (!process) throw new AppError("Processo não encontrado.", 404);
  res.json(process);
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const data = processSchema.parse(req.body);
  res.status(201).json(await processService.createProcess(req.user!.officeId, data));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const data = processUpdateSchema.parse(req.body);
  res.json(await processService.updateProcess(req.params.id, req.user!.officeId, data));
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await processService.deleteProcess(req.params.id, req.user!.officeId);
  res.status(204).send();
}
