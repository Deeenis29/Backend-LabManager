import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // requests por IP en window (ajusta)
  standardHeaders: true,
  legacyHeaders: false,
});
