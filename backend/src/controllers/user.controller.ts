import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { userSchema, userUpdateSchema } from "../validators/user.schema";
import * as userService from "../services/user.service";

export async function list(req: AuthenticatedRequest, res: Response) {
  res.json(await userService.listUsers(req.user!.officeId));
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const data = userSchema.parse(req.body);
  res.status(201).json(await userService.createUser(req.user!.officeId, data));
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const data = userUpdateSchema.parse(req.body);
  res.json(await userService.updateUser(req.params.id, req.user!.officeId, data));
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await userService.deleteUser(req.params.id, req.user!.officeId);
  res.status(204).send();
}
