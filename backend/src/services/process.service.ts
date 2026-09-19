import { prisma } from "../lib/prisma";

export async function listProcesses(officeId: string, status?: string) {
  return prisma.process.findMany({
    where: { officeId, ...(status ? { status: status as any } : {}) },
    include: { client: true, responsibleUser: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProcessById(id: string, officeId: string) {
  return prisma.process.findFirst({
    where: { id, officeId },
    include: {
      client: true,
      responsibleUser: true,
      tasks: true,
      events: true,
      documents: true,
      history: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function createProcess(officeId: string, data: any) {
  const process = await prisma.process.create({ data: { officeId, ...data } });
  await prisma.processHistory.create({
    data: { processId: process.id, note: "Processo criado." },
  });
  return process;
}

export async function updateProcess(id: string, officeId: string, data: any) {
  const before = await prisma.process.findFirst({ where: { id, officeId } });
  const process = await prisma.process.update({ where: { id }, data });
  if (before && data.status && data.status !== before.status) {
    await prisma.processHistory.create({
      data: { processId: id, note: `Status alterado de ${before.status} para ${data.status}.` },
    });
  }
  return process;
}

export async function deleteProcess(id: string, _officeId: string) {
  await prisma.process.update({ where: { id }, data: { status: "ARQUIVADO" } });
}
