import { Role, DocumentType, Gender } from "@prisma/client";

/**
 * Datos de entrada para registrar un usuario
 */
export interface RegisterInput {
  email: string;
  password: string; // plain-text, luego se hashea
  role: Role;
  documentType: DocumentType;
  documentNumber: string;

  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string; // formato ISO string
  gender?: Gender;
}

/**
 * Datos de entrada para login
 */
export interface LoginInput {
  email: string;
  password: string;
}
