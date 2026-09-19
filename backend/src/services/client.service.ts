import { prisma } from "../lib/prisma";

export async function listClients(officeId: string, search?: string) {
  return prisma.client.findMany({
    where: {
      officeId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { document: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getClientById(id: string, officeId: string) {
  return prisma.client.findFirst({
    where: { id, officeId },
    include: {
      processes: true,
      tasks: true,
      documents: true,
      financialEntries: true,
      interactions: true,
    },
  });
}

export async function createClient(officeId: string, data: any) {
  return prisma.client.create({
    data: {
      officeId,
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  });
}

export async function updateClient(id: string, officeId: string, data: any) {
  return prisma.client.update({
    where: { id },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  });
}

export async function deleteClient(id: string, _officeId: string) {
  await prisma.client.update({ where: { id }, data: { status: "INACTIVE" } });
}
