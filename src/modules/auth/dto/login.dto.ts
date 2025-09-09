import { z } from "zod";

/**
 * 📌 Schema de validación para login
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDto = z.infer<typeof loginSchema>;
