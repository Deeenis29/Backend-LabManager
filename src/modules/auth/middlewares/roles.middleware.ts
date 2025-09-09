// src/modules/auth/middlewares/roles.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppRole } from "@modules/auth/utils/jwt";

/**
 * 📌 Middleware para verificar roles
 */
export const authorize =
  (...roles: AppRole[]) =>
  (req: Request & { user?: { id: number; role: AppRole } }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
