import { z } from "zod";

/**
 * 📌 Enums compartidos (evitamos repetir)
 */
export const roleEnum = z.enum([
  "ADMIN",
  "DOCTOR",
  "TECHNICIAN",
  "RECEPTIONIST",
  "PATIENT",
  "QUALITY_MANAGER",
]);

export const documentTypeEnum = z.enum([
  "DNI",
  "CE",
  "PASSPORT",
  "RUC",
  "OTHER",
]);