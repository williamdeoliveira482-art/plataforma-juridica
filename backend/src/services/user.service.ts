import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

export async function listUsers(officeId: string) {
  return prisma.user.findMany({
    where: { officeId },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { name: "asc" },
  });
}

export async function createUser(officeId: string, data: { name: string; email: string; password: string; role: any }) {
  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { officeId, name: data.name, email: data.email, passwordHash, role: data.role },
  });
  const { passwordHash: _omit, ...safe } = user;
  return safe;
}

export async function updateUser(id: string, officeId: string, data: any) {
  const payload: any = { ...data };
  if (payload.password) {
    payload.passwordHash = await hashPassword(payload.password);
    delete payload.password;
  }
  const user = await prisma.user.update({ where: { id }, data: payload });
  const { passwordHash: _omit, ...safe } = user;
  return safe;
}

export async function deleteUser(id: string, _officeId: string) {
  await prisma.user.update({ where: { id }, data: { active: false } });
}
