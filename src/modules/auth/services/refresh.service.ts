import * as repo from "@modules/auth/repo/auth.repo";
import { verifyRefreshToken, signAccessToken, signRefreshToken, JwtPayload } from "@modules/auth/utils/jwt";
import { hashToken } from "@modules/auth/utils/crypto";
import { AuditAction } from "@prisma/client";

/**
 * 📌 Rotación de Refresh Tokens
 */
export const refresh = async (rawToken: string, ip?: string, userAgent?: string) => {
  // 1. Verificar token y extraer datos válidos
  const { id, role } = verifyRefreshToken(rawToken);

  const tokenHash = hashToken(rawToken);

  // 2. Validar refresh token en DB
  const tokenRow = await repo.findRefreshToken(tokenHash);
  if (!tokenRow || tokenRow.revoked || tokenRow.expiresAt <= new Date()) {
    throw new Error("Invalid refresh token");
  }

  // 3. Crear nuevo refresh token
  const newRefreshToken = signRefreshToken({ id, role });
  const newHash = hashToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await repo.saveRefreshToken({
    tokenHash: newHash,
    userId: id,
    expiresAt,
    ipAddress: ip ?? null,
    userAgent: userAgent ?? null
  });

  // 4. Revocar el anterior
  await repo.revokeRefreshToken(tokenHash, "rotated");

  // 5. Generar access token
  const newAccessToken = signAccessToken({ id, role });

  await repo.addAuditLog(
    id,
    AuditAction.LOGIN,
    ip ?? undefined,
    "Token refreshed",
    "RefreshToken",
    tokenRow.id,
    userAgent ?? undefined
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * 📌 Cerrar sesión revocando el refresh token actual
 */
export const logout = async (rawToken: string) => {
  const tokenHash = hashToken(rawToken);
  await repo.revokeRefreshToken(tokenHash, "logout");
};
