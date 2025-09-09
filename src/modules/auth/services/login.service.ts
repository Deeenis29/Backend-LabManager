import bcrypt from "bcrypt";
import * as repo from "@modules/auth/repo/auth.repo";
import { AuditAction } from "@prisma/client";
import { LoginDto } from "@modules/auth/dto/login.dto";
import { JwtPayload, signAccessToken, signRefreshToken } from "@modules/auth/utils/jwt";
import { hashToken } from "@modules/auth/utils/crypto";

/**
 * 📌 Login de usuario con control de intentos y refresh token en DB
 */
export const login = async (input: LoginDto, ip?: string, userAgent?: string) => {
  const user = await repo.findByEmail(input.email);
  if (!user) {
    await logAudit(null, AuditAction.LOGIN_FAILED, ip, "Invalid email", userAgent);
    throw new Error("Invalid credentials");
  }

  // ⛔ Bloqueo temporal
  if (isUserLocked(user.lockedUntil)) {
    throw new Error("Account temporarily locked due to too many failed attempts");
  }

  // 🔑 Verificación de contraseña
  if (!user.passwordHash) {
    await logAudit(user.id, AuditAction.LOGIN_FAILED, ip, "Missing password hash", userAgent);
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    await handleFailedLogin(user.id, user.loginAttempts ?? 0, ip, userAgent);
    throw new Error("Invalid credentials");
  }

  // ✅ Login exitoso
  await handleSuccessfulLogin(user.id, ip, userAgent);

  const payload: JwtPayload = { id: user.id, role: user.role };
  const tokens = await generateTokens(payload, ip, userAgent);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
    },
    tokens,
  };
};

/* -------------------- 🔒 Helpers privados -------------------- */

/**
 * Verifica si el usuario está bloqueado.
 */
function isUserLocked(lockedUntil: Date | null): boolean {
  return !!lockedUntil && lockedUntil > new Date();
}

/**
 * Manejo de intentos fallidos y bloqueo temporal.
 */
async function handleFailedLogin(
  userId: number,
  currentAttempts: number,
  ip?: string,
  userAgent?: string
) {
  const attempts = currentAttempts + 1;

  if (attempts >= 5) {
    await repo.updateUser(userId, {
      loginAttempts: attempts,
      lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });

    await logAudit(userId, AuditAction.LOGIN_FAILED, ip, "Account locked", userAgent);
    throw new Error("Account locked due to too many failed attempts");
  }

  await repo.updateUser(userId, { loginAttempts: attempts });
  await logAudit(userId, AuditAction.LOGIN_FAILED, ip, "Invalid password", userAgent);
}

/**
 * Reset de intentos tras login exitoso.
 */
async function handleSuccessfulLogin(userId: number, ip?: string, userAgent?: string) {
  await repo.updateUser(userId, {
    loginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: new Date(),
  });

  await logAudit(userId, AuditAction.LOGIN, ip, "Successful login", userAgent);
}

/**
 * Genera tokens y guarda el refresh en DB.
 */
async function generateTokens(payload: JwtPayload, ip?: string, userAgent?: string) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await repo.saveRefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: payload.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    ipAddress: ip ?? null,
    userAgent: userAgent ?? null,
  });

  return { accessToken, refreshToken };
}

/**
 * Wrapper para registrar logs de auditoría.
 */
async function logAudit(
  userId: number | null,
  action: AuditAction,
  ip?: string,
  message?: string,
  userAgent?: string
) {
  await repo.addAuditLog(userId, action, ip, message ?? "", "User", userId, userAgent);
}
