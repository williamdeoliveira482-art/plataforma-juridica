import { prisma } from "../lib/prisma";

export async function listEvents(officeId: string, from?: string, to?: string) {
  return prisma.event.findMany({
    where: {
      officeId,
      ...(from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {}),
    },
    include: { client: true, process: true, responsibleUser: true },
    orderBy: { date: "asc" },
  });
}

export async function createEvent(officeId: string, data: any) {
  return prisma.event.create({ data: { officeId, ...data, date: new Date(data.date) } });
}

export async function updateEvent(id: string, _officeId: string, data: any) {
  return prisma.event.update({
    where: { id },
    data: { ...data, date: data.date ? new Date(data.date) : undefined },
  });
}

export async function deleteEvent(id: string, _officeId: string) {
  await prisma.event.delete({ where: { id } });
}
