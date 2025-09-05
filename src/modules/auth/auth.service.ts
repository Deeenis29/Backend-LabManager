import bcrypt from "bcrypt";
import { env } from "@config/env";
import { prisma } from "@db/index";
import { 
  signAccessToken, 
  signRefreshToken, 
  verifyRefreshToken 
} from "@config/jwt";
import * as repo from "@modules/auth/auth.repo";
import { LoginInput, RegisterInput } from "@modules/auth/auth.types";
import { AuditAction } from "@prisma/client"; 
import { hashToken, generateToken} from "@utils/crypto";
import { generateTOTPSecret, verifyTOTP, generateTOTPQRCode } from "@utils/topt";

/**
 * REGISTRO
 */
export const register = async (input: RegisterInput, ip?: string, userAgent?: string) => {
  const exists = await repo.findByEmail(input.email);
  if (exists) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  const passwordSalt = env.BCRYPT_SALT_ROUNDS.toString();

  const user = await repo.createUserCascade({
    ...input,
    passwordHash,
    passwordSalt,
  });

  await repo.addAuditLog(user.id, AuditAction.CREATE, ip, "User registered", "User", user.id, userAgent);

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    documentType: user.documentType,
    documentNumber: user.documentNumber,
  };
};

const LOCK_THRESHOLD = 5;
const LOCK_MINUTES = 15;

/**
 * LOGIN
 */
export const login = async (input: LoginInput, ip?: string, userAgent?: string) => {
  const user = await repo.findByEmail(input.email);
  if (!user) {
    await repo.addAuditLog(null, AuditAction.LOGIN_FAILED, ip, "Invalid email", "User", null, userAgent);
    throw new Error("Invalid credentials");
  }

  // bloqueado
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error("Account locked. Try later.");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1;
    const updateData: any = { loginAttempts: attempts };
    if (attempts >= LOCK_THRESHOLD) {
      updateData.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });
    await repo.addAuditLog(user.id, AuditAction.LOGIN_FAILED, ip, `Failed login #${attempts}`, "User", user.id, userAgent);
    throw new Error("Invalid credentials");
  }

  // reset intentos
  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() }
  });

  // generar tokens
  const payload = { id: user.id, role: user.role as any };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // guardar refresh token en DB
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: ip ?? null,
      userAgent: userAgent ?? null,
    }
  });

  await repo.addAuditLog(user.id, AuditAction.LOGIN, ip, "User logged in", "User", user.id, userAgent);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * REFRESH TOKEN (rotación + blacklist)
 */
export const refresh = async (rawToken: string, ip?: string, userAgent?: string) => {
  try {
    const payload = verifyRefreshToken(rawToken);
    const tokenHash = hashToken(rawToken);

    const tokenRow = await prisma.refreshToken.findUnique({ where: { tokenHash }});
    if (!tokenRow || tokenRow.revoked || tokenRow.expiresAt <= new Date()) {
      throw new Error("Invalid refresh token");
    }

    // crear nuevo refresh
    const newRefreshToken = signRefreshToken({ id: payload.id, role: payload.role });
    const newHash = hashToken(newRefreshToken);

    const created = await prisma.refreshToken.create({
      data: {
        tokenHash: newHash,
        userId: payload.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: ip ?? null,
        userAgent: userAgent ?? null,
      }
    });

    // revocar anterior
    await prisma.refreshToken.update({
      where: { tokenHash },
      data: { revoked: true, replacedById: created.id, reason: "rotated" },
    });

    const newAccessToken = signAccessToken({ id: payload.id, role: payload.role });
    await repo.addAuditLog(payload.id, AuditAction.LOGIN, ip, "Refreshed token", "RefreshToken", tokenRow.id, userAgent);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    throw new Error("Invalid refresh token");
  }
};

/**
 * LOGOUT (revoca el refresh actual)
 */
export const logout = async (userId: number, ip?: string, userAgent?: string) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true, reason: "logout" },
  });

  await repo.addAuditLog(userId, AuditAction.LOGOUT, ip, "User logged out", "User", userId, userAgent);
  return { success: true };
};


/**
 * LOGOUT ALL (revoca todos los refresh tokens de un usuario)
 */
export const logoutAll = async (userId: number, ip?: string, userAgent?: string) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true, reason: "logout_all" }
  });

  await repo.addAuditLog(userId, AuditAction.LOGOUT, ip, "User logged out everywhere", "User", userId, userAgent);
  return { success: true };
};

export const forgotPassword = async (email: string, ip?: string, userAgent?: string) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("User not found");

  const resetToken = generateToken(32);
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await repo.setPasswordResetToken(user.id, resetToken, expires);

  // Simulación → normalmente envías por correo
  console.log(`🔑 Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

  await repo.addAuditLog(user.id, AuditAction.PASSWORD_RESET, ip, "Password reset requested", "User", user.id, userAgent);

  return { resetToken, expires };
};

// Reset password
export const resetPassword = async (token: string, newPassword: string, ip?: string, userAgent?: string) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordSalt: env.BCRYPT_SALT_ROUNDS.toString(),
      lastPasswordChange: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  await repo.addAuditLog(user.id, AuditAction.PASSWORD_RESET, ip, "Password reset successful", "User", user.id, userAgent);

  return { success: true };
};

export const getUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
};

// Activar 2FA (fase inicial: generar secret y QR)
export const setup2FA = async (userId: number, email: string) => {
  const secret = generateTOTPSecret();
  const qr = await generateTOTPQRCode(email, secret);

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
  });

  return { qr, secret }; // ⚡ ojo, solo para pruebas devuelve el secret
};


// Verificar el token de Google Authenticator
export const verify2FA = async (userId: number, token: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorSecret) throw new Error("2FA not setup");

  const isValid = verifyTOTP(token, user.twoFactorSecret);
  if (!isValid) throw new Error("Invalid or expired token");

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  return { success: true, message: "2FA enabled" };
};


// Deshabilitar 2FA
export const disable2FA = async (userId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  return { success: true, message: "2FA disabled" };
};