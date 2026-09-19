import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "LAWYER", "FINANCE", "ASSISTANT"]),
});

export const userUpdateSchema = userSchema.partial().omit({ password: true }).extend({
  password: z.string().min(6).optional(),
  active: z.boolean().optional(),
});
