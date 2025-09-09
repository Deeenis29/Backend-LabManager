import { z } from "zod";

/**
 * 📌 Schema de validación para "forgot password"
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
