import { authenticator } from "otplib";
import qrcode from "qrcode";

// Generar secreto nuevo para un usuario
export const generateTOTPSecret = () => {
  const secret = authenticator.generateSecret();
  return secret;
};

// Generar QR Code para escanear en Google Authenticator
export const generateTOTPQRCode = async (email: string, secret: string) => {
  const otpauth = authenticator.keyuri(email, "LabManager", secret);
  return await qrcode.toDataURL(otpauth);
};

// Verificar un código TOTP
export const verifyTOTP = (token: string, secret: string) => {
  return authenticator.verify({ token, secret });
};
