import bcrypt from "bcrypt";
import { Resend } from "resend";
import * as crypto from "crypto";
import * as repo from "@modules/auth/repo/auth.repo";
import { AuditAction } from "@prisma/client";
import { generateToken } from "@modules/auth/utils/crypto";
import { env } from "@config/env";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * 📌 Cambiar contraseña autenticado
 */
export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
  ip?: string,
  userAgent?: string
) => {
  const user = await repo.findById(userId);
  if (!user?.passwordHash) throw new Error("User not found or no password set");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  const newHash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  const newSalt = env.BCRYPT_SALT_ROUNDS.toString();

  await repo.updateUser(user.id, {
    passwordHash: newHash,
    passwordSalt: newSalt,
    lastPasswordChange: new Date(),
  });

  await repo.addAuditLog(
    user.id,
    AuditAction.UPDATE,
    ip,
    "Password changed",
    "User",
    user.id,
    userAgent
  );

  return { success: true };
};

/**
 * 📌 Generar token para reset de contraseña (no se usa directamente)
 */
export const requestPasswordReset = async (email: string) => {
  const user = await repo.findByEmail(email);
  if (!user) return { success: true }; // seguridad → no revelar si existe

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await repo.setPasswordResetToken(user.id, token, expires);

  return { success: true, token }; // ⚠️ en prod nunca devuelvas el token
};

/**
 * 📌 Reset password con token
 */
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await repo.findByResetToken(token);
  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    throw new Error("Invalid or expired token");
  }

  const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  const passwordSalt = env.BCRYPT_SALT_ROUNDS.toString();

  await repo.updateUser(user.id, {
    passwordHash,
    passwordSalt,
    passwordResetToken: null,
    passwordResetExpires: null,
    lastPasswordChange: new Date(),
  });
};

/**
 * 📌 Forgot password: genera token y envía email
 */
export const forgotPassword = async (email: string) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("User not found");

  // Generar token temporal seguro
  const token = generateToken(32); // 32 bytes → 64 chars hex
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // Guardar en DB
  await repo.setPasswordResetToken(user.id, token, expires);

  // URL de reset (puede apuntar a tu frontend o backend)
  const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;

  // Enviar correo con Resend
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <p>Hello ${user.profile?.firstName || "user"},</p>
      <p>You requested a password reset. Click below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });

  // 👇 usamos env.NODE_ENV, no process.env
  return env.NODE_ENV === "development"
    ? { message: "Password reset link sent", resetUrl }
    : { message: "Password reset link sent" };
};
