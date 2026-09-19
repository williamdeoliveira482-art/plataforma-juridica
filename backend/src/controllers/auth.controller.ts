import { Response } from "express";
import { loginSchema } from "../validators/auth.schema";
import { loginUser } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";

export async function login(req: AuthenticatedRequest, res: Response) {
  const data = loginSchema.parse(req.body);
  const result = await loginUser(data.email, data.password);
  res.json(result);
}

export async function me(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, officeId: true },
  });
  res.json(user);
}

export async function logout(_req: AuthenticatedRequest, res: Response) {
  res.json({ message: "Sessão encerrada." });
}
