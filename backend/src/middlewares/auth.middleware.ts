import { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    officeId: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Não autenticado.", 401);
  }
  const token = header.replace("Bearer ", "");
  try {
    const payload = verifyUserToken(token);
    req.user = { id: payload.sub, role: payload.role, officeId: payload.officeId };
    next();
  } catch {
    throw new AppError("Sessão inválida ou expirada.", 401);
  }
}
