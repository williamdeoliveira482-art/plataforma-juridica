import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { clientSchema, clientUpdateSchema } from "../validators/client.schema";
import * as clientService from "../services/client.service";
import { AppError } from "../utils/AppError";

export async function list(req: AuthenticatedRequest, res: Response) {
  const search = req.query.search as string | undefined;
  res.json(await clientService.listClients(req.user!.officeId, search));
}

export async function getById(req: AuthenticatedRequest, res: Response) {
  const client = await clientService.getClientById(req.params.id, req.user!.officeId);
  if (!client) throw new AppError("Cliente não encontrado.", 404);
  res.json(client);
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const data = clientSchema.parse(req.body);
  res.status(201).json(await clientService.createClient(req.user!.officeId, data));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const data = clientUpdateSchema.parse(req.body);
  res.json(await clientService.updateClient(req.params.id, req.user!.officeId, data));
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await clientService.deleteClient(req.params.id, req.user!.officeId);
  res.status(204).send();
}
