import { z } from "zod";

/**
 * 📌 Schema de validación para verificación de código 2FA
 */
export const verify2FASchema = z.object({
  token: z.string().min(6).max(6), // Google Authenticator codes son de 6 dígitos
});

export type Verify2FADto = z.infer<typeof verify2FASchema>;
