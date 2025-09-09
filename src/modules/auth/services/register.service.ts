import bcrypt from "bcrypt";
import { env } from "@config/env";
import * as repo from "@modules/auth/repo/auth.repo";
import { AuditAction, Role, DocumentType, Gender } from "@prisma/client";
import { RegisterDTO } from "@modules/auth/dto/register.dto";
import { string } from "zod";

/**
 * 📌 Registro de usuario
 */

export const register = async (input: RegisterDTO, ip?: string, userAgent?: string) => {
  const exists = await repo.findByEmail(input.email);
  if (exists) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  const passwordSalt = env.BCRYPT_SALT_ROUNDS.toString();

  const userPayload: Parameters<typeof repo.createUserCascade>[0] = {
    email: input.email,
    passwordHash,
    passwordSalt,
    role: Role.PATIENT,
    documentType: input.documentType as DocumentType,
    documentNumber: input.documentNumber,
    ...(input.firstName ? { firstName: input.firstName } : {}),
    ...(input.lastName ? { lastName: input.lastName } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.birthDate ? { birthDate: input.birthDate } : {}),
    ...(input.gender ? { gender: input.gender as Gender } : {}),
  };

  const user = await repo.createUserCascade(userPayload);

  await repo.addAuditLog(
    user.id,
    AuditAction.CREATE,
    ip ?? undefined,
    "User registered",
    "User",
    user.id,
    userAgent ?? null
  );

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    documentType: user.documentType,
    documentNumber: user.documentNumber,
  };
};
