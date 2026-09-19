import { NextFunction, Request, Response } from "express";
import { verifyClientToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export interface ClientPortalRequest extends Request {
  clientId?: string;
}

export function requireClientAuth(req: ClientPortalRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Não autenticado.", 401);
  }
  try {
    const payload = verifyClientToken(header.replace("Bearer ", ""));
    req.clientId = payload.clientId;
    next();
  } catch {
    throw new AppError("Sessão inválida ou expirada.", 401);
  }
}
