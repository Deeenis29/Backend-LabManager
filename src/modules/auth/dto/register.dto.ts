import { DocumentType, Gender } from "@prisma/client";
import { z } from "zod";

/**
 * 📌 Schema de validación para registro de usuario
 */
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
