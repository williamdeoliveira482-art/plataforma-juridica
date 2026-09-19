import { z } from "zod";

export const financialEntrySchema = z.object({
  clientId: z.string().uuid(),
  processId: z.string().uuid().optional(),
  description: z.string().min(2),
  amount: z.number().positive(),
  dueDate: z.string().datetime(),
  status: z.enum(["PENDENTE", "PAGO", "ATRASADO", "CANCELADO"]).optional(),
});

export const financialEntryUpdateSchema = financialEntrySchema.partial();

export const paymentSchema = z.object({
  amount: z.number().positive(),
  method: z.string().optional(),
});
