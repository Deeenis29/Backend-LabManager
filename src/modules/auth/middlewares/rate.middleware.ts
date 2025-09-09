import rateLimit from "express-rate-limit";

/**
 * 📌 Límite de intentos en rutas sensibles
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: { error: "Too many login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
