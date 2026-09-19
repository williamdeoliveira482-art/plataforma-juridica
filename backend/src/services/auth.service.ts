import { prisma } from "../lib/prisma";
import { comparePassword } from "../utils/password";
import { signUserToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    throw new AppError("Credenciais inválidas.", 401);
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError("Credenciais inválidas.", 401);
  }
  const token = signUserToken({ sub: user.id, role: user.role, officeId: user.officeId, kind: "user" });
  const { passwordHash: _omit, ...safeUser } = user;
  return { token, user: safeUser };
}
