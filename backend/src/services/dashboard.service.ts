import { prisma } from "../lib/prisma";

export async function getDashboardSummary(officeId: string) {
  const now = new Date();
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    activeClients,
    newClientsThisMonth,
    processesInProgress,
    processesConcluded,
    upcomingDeadlines,
    upcomingHearings,
    pendingTasks,
    priorityTasks,
    financialEntries,
  ] = await Promise.all([
    prisma.client.count({ where: { officeId, status: "ACTIVE" } }),
    prisma.client.count({
      where: { officeId, createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
    }),
    prisma.process.count({ where: { officeId, status: { in: ["EM_ANDAMENTO", "AGUARDANDO_CLIENTE"] } } }),
    prisma.process.count({ where: { officeId, status: "CONCLUIDO" } }),
    prisma.event.count({ where: { officeId, type: "PRAZO", date: { gte: now, lte: in7days } } }),
    prisma.event.count({ where: { officeId, type: "AUDIENCIA", date: { gte: now, lte: in7days } } }),
    prisma.task.count({ where: { officeId, status: "PENDENTE" } }),
    prisma.task.count({ where: { officeId, status: "PENDENTE", priority: { in: ["ALTA", "URGENTE"] } } }),
    prisma.financialEntry.findMany({ where: { officeId } }),
  ]);

  const receivable = financialEntries
    .filter((e) => e.status === "PENDENTE" || e.status === "ATRASADO")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const overdueCount = financialEntries.filter((e) => e.status === "PENDENTE" && e.dueDate < now).length;

  return {
    activeClients,
    newClientsThisMonth,
    processesInProgress,
    processesConcluded,
    upcomingDeadlines,
    upcomingHearings,
    pendingTasks,
    priorityTasks,
    receivable,
    overdueCount,
  };
}

export async function getDashboardCharts(officeId: string) {
  const processesByStatus = await prisma.process.groupBy({
    by: ["status"],
    where: { officeId },
    _count: true,
  });

  const processesByArea = await prisma.process.groupBy({
    by: ["area"],
    where: { officeId },
    _count: true,
  });

  const clients = await prisma.client.findMany({ where: { officeId }, select: { createdAt: true } });
  const clientsByMonth: Record<string, number> = {};
  for (const c of clients) {
    const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, "0")}`;
    clientsByMonth[key] = (clientsByMonth[key] ?? 0) + 1;
  }

  return {
    processesByStatus: processesByStatus.map((p) => ({ status: p.status, count: p._count })),
    processesByArea: processesByArea.map((p) => ({ area: p.area, count: p._count })),
    clientsByMonth: Object.entries(clientsByMonth).map(([month, count]) => ({ month, count })),
  };
}
