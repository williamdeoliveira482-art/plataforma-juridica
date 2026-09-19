import { z } from "zod";

export const eventSchema = z.object({
  type: z.enum(["AUDIENCIA", "REUNIAO", "PRAZO", "COMPROMISSO"]),
  title: z.string().min(2),
  date: z.string().datetime(),
  responsibleUserId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  processId: z.string().uuid().optional(),
  description: z.string().optional(),
});

export const eventUpdateSchema = eventSchema.partial();
