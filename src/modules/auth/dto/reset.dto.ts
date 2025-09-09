import { z } from "zod";

/**
 * 📌 Schema de validación para reset password
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  newPassword: z.string().min(6),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
