import { prisma } from "../lib/prisma";

export async function listTasks(officeId: string, filters: { responsibleUserId?: string; status?: string } = {}) {
  return prisma.task.findMany({
    where: {
      officeId,
      ...(filters.responsibleUserId ? { responsibleUserId: filters.responsibleUserId } : {}),
      ...(filters.status ? { status: filters.status as any } : {}),
    },
    include: { client: true, process: true, responsibleUser: true },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
}

export async function createTask(officeId: string, data: any) {
  return prisma.task.create({
    data: { officeId, ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
  });
}

export async function updateTask(id: string, _officeId: string, data: any) {
  return prisma.task.update({
    where: { id },
    data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
  });
}

export async function deleteTask(id: string, _officeId: string) {
  await prisma.task.delete({ where: { id } });
}
