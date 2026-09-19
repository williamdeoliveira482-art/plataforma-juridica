import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  responsibleUserId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  processId: z.string().uuid().optional(),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]).optional(),
  status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]).optional(),
  dueDate: z.string().datetime().optional().or(z.literal("")),
});

export const taskUpdateSchema = taskSchema.partial();
