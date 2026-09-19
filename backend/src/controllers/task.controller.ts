import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { taskSchema, taskUpdateSchema } from "../validators/task.schema";
import * as taskService from "../services/task.service";

export async function list(req: AuthenticatedRequest, res: Response) {
  const { responsibleUserId, status, mine } = req.query as Record<string, string>;
  const filters = {
    responsibleUserId: mine === "true" ? req.user!.id : responsibleUserId,
    status,
  };
  res.json(await taskService.listTasks(req.user!.officeId, filters));
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const data = taskSchema.parse(req.body);
  res.status(201).json(await taskService.createTask(req.user!.officeId, data));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const data = taskUpdateSchema.parse(req.body);
  res.json(await taskService.updateTask(req.params.id, req.user!.officeId, data));
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await taskService.deleteTask(req.params.id, req.user!.officeId);
  res.status(204).send();
}
