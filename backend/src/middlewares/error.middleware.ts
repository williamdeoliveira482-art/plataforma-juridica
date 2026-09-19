import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: "Dados inválidos.",
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor." });
}

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada." });
}

export function asyncHandler(fn: (req: any, res: Response, next: NextFunction) => Promise<any>) {
  return (req: any, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
