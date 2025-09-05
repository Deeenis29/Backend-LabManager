import { prisma } from "@config/db";
import { AuditAction } from "@prisma/client";
import { RegisterInput } from "@modules/auth/auth.types";

/**
 * Busca usuario por email
 */
export const findByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
    include: { profile: true, patient: true, doctor: true },
  });

/**
 * Crea usuario + Profile opcional + Patient/Doctor según rol
 */
export const createUserCascade = async (input: RegisterInput & { passwordHash: string; passwordSalt: string }) => {
  const {
    email,
    passwordHash,
    passwordSalt,
    role,
    documentType,
    documentNumber,
    firstName,
    lastName,
    phone,
    birthDate,
    gender,
  } = input;

  const user = await prisma.user.create({
  data: {
    email,
    passwordHash,
    passwordSalt,
    role,
    documentType,
    documentNumber,

    // profile solo si hay datos
    ...(firstName || lastName || phone || birthDate || gender
      ? {
          profile: {
            create: {
              firstName: firstName ?? "",
              lastName: lastName ?? "",
              phone: phone ?? null,
              birthDate: birthDate ? new Date(birthDate) : null,
              gender: gender ?? null,
            },
          },
        }
      : {}),

    // patient solo si es paciente
    ...(role === "PATIENT"
      ? {
          patient: { create: {} },
        }
      : {}),

    // doctor solo si es doctor
    ...(role === "DOCTOR"
      ? {
          doctor: {
            create: {
              licenseNumber: `TMP-${Date.now()}`,
              collegeMember: null,
            },
          },
        }
      : {}),
  },
  include: { profile: true, patient: true, doctor: true },
});

  return user;
};

/**
 * Inserta un log en la tabla AuditLog
 */
export const addAuditLog = async (
  userId: number | null,
  action: AuditAction,
  ip?: string,
  description?: string,
  tableName: string = "User",
  recordId?: number | null,
  userAgent?: string
) => {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      tableName,
      recordId: recordId ?? userId ?? null,
      ipAddress: ip ?? null,
      userAgent: userAgent ?? null,
      description: description ?? null,
      severity: "INFO",
    },
  });
};


export const setPasswordResetToken = async (userId: number, token: string, expires: Date) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });
};

export const findByPasswordResetToken = async (token: string) => {
  return prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() }, // válido solo si no expiró
    },
  });
};

export const resetPassword = async (userId: number, passwordHash: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      lastPasswordChange: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
};