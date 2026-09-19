import { Response } from "express";
import { clientPortalLoginSchema } from "../validators/auth.schema";
import * as clientPortalService from "../services/clientPortal.service";
import { ClientPortalRequest } from "../middlewares/clientPortalAuth.middleware";

export async function login(req: ClientPortalRequest, res: Response) {
  const data = clientPortalLoginSchema.parse(req.body);
  const result = await clientPortalService.loginClientPortal(data.email, data.password);
  res.json(result);
}

export async function me(req: ClientPortalRequest, res: Response) {
  res.json(await clientPortalService.getClientPortalData(req.clientId!));
}
