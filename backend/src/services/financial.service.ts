import { prisma } from "../lib/prisma";

export async function listFinancialEntries(officeId: string, status?: string) {
  return prisma.financialEntry.findMany({
    where: { officeId, ...(status ? { status: status as any } : {}) },
    include: { client: true, process: true, payments: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function createFinancialEntry(officeId: string, data: any) {
  return prisma.financialEntry.create({
    data: { officeId, ...data, dueDate: new Date(data.dueDate) },
  });
}

export async function updateFinancialEntry(id: string, _officeId: string, data: any) {
  return prisma.financialEntry.update({
    where: { id },
    data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
  });
}

export async function deleteFinancialEntry(id: string, _officeId: string) {
  await prisma.financialEntry.update({ where: { id }, data: { status: "CANCELADO" } });
}

export async function registerPayment(financialEntryId: string, amount: number, method?: string) {
  const payment = await prisma.payment.create({
    data: { financialEntryId, amount, method },
  });
  await prisma.financialEntry.update({ where: { id: financialEntryId }, data: { status: "PAGO" } });
  return payment;
}

export async function financialSummary(officeId: string) {
  const entries = await prisma.financialEntry.findMany({ where: { officeId } });
  const now = new Date();
  const totalReceivable = entries
    .filter((e) => e.status === "PENDENTE" || e.status === "ATRASADO")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalReceived = entries.filter((e) => e.status === "PAGO").reduce((sum, e) => sum + Number(e.amount), 0);
  const overdue = entries.filter((e) => e.status === "PENDENTE" && e.dueDate < now);
  const totalOverdue = overdue.reduce((sum, e) => sum + Number(e.amount), 0);
  const upcoming = entries
    .filter((e) => e.status === "PENDENTE" && e.dueDate >= now)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  return { totalReceivable, totalReceived, totalOverdue, upcoming };
}
