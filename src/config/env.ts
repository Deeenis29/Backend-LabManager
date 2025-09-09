import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(14).default(10),

  // 👇 es API KEY, no URL
  RESEND_API_KEY: z.string().min(10),  

  // Para que el link del email funcione (frontend o backend)
  APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
