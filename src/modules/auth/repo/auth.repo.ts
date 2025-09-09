import { Prisma } from "@prisma/client";
import { prisma } from "@config/db";
import { AuditAction, Role, DocumentType, Gender } from "@prisma/client";

/**
 * 📌 Buscar usuario por email
 */
export const findByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
    include: { profile: true, patient: true, doctor: true },
  });

/**
 * 📌 Crear usuario y cascade según rol
 */
export const createUserCascade = async (input: {
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  role: Role;
  documentType: DocumentType;
  documentNumber: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
}) => {
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

  return prisma.user.create({
    data: {
      email,
      passwordHash: passwordHash ?? null,
      passwordSalt: passwordSalt ?? null,
      role,
      documentType,
      documentNumber,

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

      ...(role === "PATIENT" ? { patient: { create: {} } } : {}),
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
};

/**
 * 📌 Guardar Refresh Token
 */
export const saveRefreshToken = (data: {
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}) =>
  prisma.refreshToken.create({
    data: {
      tokenHash: data.tokenHash,
      userId: data.userId,
      expiresAt: data.expiresAt,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
    },
  });

/**
 * 📌 Buscar Refresh Token por hash
 */
export const findRefreshToken = (tokenHash: string) =>
  prisma.refreshToken.findUnique({ where: { tokenHash } });

/**
 * 📌 Revocar un refresh token
 */
export const revokeRefreshToken = (tokenHash: string, reason: string) =>
  prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true, reason },
  });

/**
 * 📌 Revocar todos los refresh tokens de un usuario
 */
export const revokeAllRefreshTokensForUser = (userId: number, reason: string) =>
  prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true, reason },
  });

/**
 * 📌 Insertar log en AuditLog
 */
export const addAuditLog = async (
  userId: number | null,
  action: AuditAction,
  ip?: string,
  description?: string,
  tableName: string = "User",
  recordId?: number | null,
  userAgent?: string | null
) => {
  return prisma.auditLog.create({
    data: {
      userId: userId ?? null,
      action,
      tableName,
      recordId: recordId ?? null,
      ipAddress: ip ?? null,
      userAgent: userAgent ?? null,
      description: description ?? null,
      severity: "INFO",
    },
  });
};

/**
 * 📌 Guardar token de reset password
 */
export const setPasswordResetToken = async (
  userId: number,
  token: string,
  expires: Date
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordResetToken: token, passwordResetExpires: expires },
  });
};

/**
 * 📌 Buscar usuario por ID (con relaciones)
 */
export const findById = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    include: { profile: true, patient: true, doctor: true },
  });

/**
 * 📌 Buscar usuario por ID con select dinámico
 */
export const findByIdSelect = async <T extends Prisma.UserSelect>(
  id: number,
  select: T
): Promise<Prisma.UserGetPayload<{ select: T }> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select,
  });
};
/**
 * 📌 Actualizar usuario
 */
export const updateUser = (
  id: number,
  data: Partial<{
    passwordHash: string | null;
    passwordSalt: string | null;
    lastPasswordChange: Date;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    loginAttempts: number;
    lockedUntil: Date | null;
    lastLoginAt: Date;
    isActive: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
  }>
) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * 📌 Buscar usuario por token de reset password
 */
export const findByResetToken = (token: string) =>
  prisma.user.findFirst({
    where: { passwordResetToken: token },
  });

/**
 * 📌 Guardar secreto de 2FA
 */
export const setTwoFactorSecret = (userId: number, secret: string) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    },
  });

/**
 * 📌 Activar 2FA
 */
export const enable2FA = (userId: number) =>
  prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

/**
 * 📌 Desactivar 2FA
 */
export const disable2FA = (userId: number) =>
  prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
