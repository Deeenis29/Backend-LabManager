import { z } from "zod";

export const roleEnum = z.enum([
  "ADMIN",
  "DOCTOR",
  "TECHNICIAN",
  "RECEPTIONIST",
  "PATIENT",
  "QUALITY_MANAGER",
]);

export const documentTypeEnum = z.enum(["DNI", "CE", "PASSPORT", "RUC", "OTHER"]);

const passwordRules = z.string().min(6, "Password must be at least 6 characters");

export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordRules,
  role: roleEnum,
  documentType: documentTypeEnum,
  documentNumber: z.string().min(5),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordRules,
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  newPassword: z.string().min(6),
});