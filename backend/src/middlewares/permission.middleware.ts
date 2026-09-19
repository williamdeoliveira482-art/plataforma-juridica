import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { AppError } from "../utils/AppError";

/**
 * Middleware de permissão por papel. No MVP os papéis são fixos
 * (ADMIN, LAWYER, FINANCE, ASSISTANT); a estrutura está pronta para
 * evoluir para permissões granulares configuráveis por escritório.
 */
export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Não autenticado.", 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError("Você não tem permissão para executar esta ação.", 403);
    }
    next();
  };
}
