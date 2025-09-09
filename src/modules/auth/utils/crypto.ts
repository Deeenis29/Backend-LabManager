import * as crypto from "crypto";

/**
 * 📌 Hashea un token (ej. refresh tokens antes de guardar en DB)
 */
export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * 📌 Genera un token seguro random (ej. reset password)
 */
export const generateToken = (length = 40) =>
  crypto.randomBytes(length).toString("hex");
