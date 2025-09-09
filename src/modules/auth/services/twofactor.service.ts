import * as repo from "@modules/auth/repo/auth.repo";
import { generateTOTPSecret, generateTOTPQRCode, verifyTOTP } from "@modules/auth/utils/topt";
import { AuditAction } from "@prisma/client";

/**
 * 📌 Generar secreto y QR (NO activa 2FA todavía)
 */
export const setup2FA = async (userId: number, email: string) => {
  const secret = generateTOTPSecret();
  const qr = await generateTOTPQRCode(email, secret);

  // Guardamos el secreto pero no activamos todavía
  await repo.setTwoFactorSecret(userId, secret);

  return { qr, secret };
};

/**
 * 📌 Verificar código TOTP y activar 2FA
 */
export const verify2FA = async (userId: number, token: string) => {
  const user = await repo.findByIdSelect(userId, {
    twoFactorSecret: true,
    twoFactorEnabled: true,
  });

  if (!user || !user.twoFactorSecret) {
    throw new Error("2FA not configured");
  }

  const isValid = verifyTOTP(token, user.twoFactorSecret); 
  if (!isValid) throw new Error("Invalid 2FA code");

  await repo.enable2FA(userId);

  return { success: true, twoFactorEnabled: true };
};

/**
 * 📌 Deshabilitar 2FA
 */
export const disable2FA = async (userId: number) => {
  await repo.disable2FA(userId);
  return { success: true, twoFactorEnabled: false };
};
