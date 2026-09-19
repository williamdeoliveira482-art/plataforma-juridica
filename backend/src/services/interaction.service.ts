import { prisma } from "../lib/prisma";

export async function listInteractions(officeId: string) {
  return prisma.interaction.findMany({
    where: { officeId },
    include: { client: true, responsibleUser: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInteraction(officeId: string, data: any) {
  return prisma.interaction.create({ data: { officeId, ...data } });
}

export async function updateInteraction(id: string, _officeId: string, data: any) {
  return prisma.interaction.update({ where: { id }, data });
}
