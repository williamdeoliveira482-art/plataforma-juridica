import { prisma } from "../lib/prisma";
import { comparePassword } from "../utils/password";
import { signClientToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export async function loginClientPortal(email: string, password: string) {
  const access = await prisma.clientPortalAccess.findUnique({ where: { email }, include: { client: true } });
  if (!access || !access.active) {
    throw new AppError("Credenciais inválidas.", 401);
  }
  const valid = await comparePassword(password, access.passwordHash);
  if (!valid) {
    throw new AppError("Credenciais inválidas.", 401);
  }
  const token = signClientToken({ sub: access.id, clientId: access.clientId, kind: "client" });
  return { token, client: access.client };
}

export async function getClientPortalData(clientId: string) {
  return prisma.client.findUnique({
    where: { id: clientId },
    include: {
      processes: true,
      documents: { include: { category: true } },
      financialEntries: { include: { payments: true } },
      tasks: { where: { status: { not: "CANCELADA" } } },
    },
  });
}
