import { z } from "zod";

export const processSchema = z.object({
  clientId: z.string().uuid(),
  number: z.string().min(1),
  area: z.string().min(1),
  court: z.string().optional(),
  chamber: z.string().optional(),
  responsibleUserId: z.string().uuid().optional(),
  status: z
    .enum([
      "NOVO_CASO",
      "EM_ANALISE",
      "AGUARDANDO_DOCUMENTACAO",
      "EM_ANDAMENTO",
      "AGUARDANDO_CLIENTE",
      "CONCLUIDO",
      "ARQUIVADO",
    ])
    .optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const processUpdateSchema = processSchema.partial();
