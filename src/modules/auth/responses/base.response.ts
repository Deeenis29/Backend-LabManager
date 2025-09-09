import { Response } from "express";

/**
 * 📌 Respuesta exitosa estándar
 */
export const ok = (res: Response, data: any = null, message?: string, status: number = 200) =>
  res.status(status).json({
    success: true,
    message: message ?? undefined,
    data,
  });

/**
 * 📌 Respuesta de fallo estándar (400)
 */
export const fail = (res: Response, message: string, status: number = 400, errors?: any) =>
  res.status(status).json({
    success: false,
    message,
    errors,
  });

/**
 * 📌 Respuesta de error inesperado (500)
 */
export const error = (res: Response, message = "Internal server error", status: number = 500, errors?: any) =>
  res.status(status).json({
    success: false,
    message,
    errors,
  });
