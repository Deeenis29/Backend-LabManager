import { z } from "zod";

/**
 * 📌 Schema de validación para refrescar tokens
 */
export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export type RefreshDto = z.infer<typeof refreshSchema>;
