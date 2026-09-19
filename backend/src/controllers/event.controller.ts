import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { eventSchema, eventUpdateSchema } from "../validators/event.schema";
import * as eventService from "../services/event.service";

export async function list(req: AuthenticatedRequest, res: Response) {
  const { from, to } = req.query as Record<string, string>;
  res.json(await eventService.listEvents(req.user!.officeId, from, to));
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const data = eventSchema.parse(req.body);
  res.status(201).json(await eventService.createEvent(req.user!.officeId, data));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const data = eventUpdateSchema.parse(req.body);
  res.json(await eventService.updateEvent(req.params.id, req.user!.officeId, data));
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await eventService.deleteEvent(req.params.id, req.user!.officeId);
  res.status(204).send();
}
