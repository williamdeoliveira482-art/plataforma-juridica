import { z } from "zod";

export const clientSchema = z.object({
  type: z.enum(["PF", "PJ"]),
  name: z.string().min(2),
  document: z.string().min(5),
  rg: z.string().optional(),
  birthDate: z.string().datetime().optional().or(z.literal("")).optional(),
  responsible: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const clientUpdateSchema = clientSchema.partial();
