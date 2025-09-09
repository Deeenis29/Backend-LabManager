import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { fail } from "@modules/auth/responses/base.response";

/**
 * Middleware de validación con zod
 * - schema puede ser un object que valide directamente el body
 * - o un objeto con 'body'/'query'/'params' (si lo prefieres)
 */
export const validate = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    return next();
  } catch (err: any) {
    return fail(res, "Validation error", 400, err.errors ?? err);
  }
};
