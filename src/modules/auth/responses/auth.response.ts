import { Response } from "express";
import { ok, fail } from "./base.response";

/**
 * Tipos de payloads usados por la UI/cliente
 */
export type AuthUserDTO = {
  id: number;
  email: string;
  role: string;
  documentType?: string;
  documentNumber?: string;
};

export type TokensDTO = {
  accessToken: string;
  refreshToken?: string;
};

/**
 * 📌 Login
 */
export const loginResponse = (res: Response, tokens: TokensDTO, user: AuthUserDTO) =>
  ok(res, { user, tokens }, "Authenticated");

/**
 * 📌 Register
 */
export const registerResponse = (res: Response, user: AuthUserDTO) =>
  ok(res, { user }, "User created");

/**
 * 📌 Refresh token
 */
export const refreshResponse = (res: Response, tokens: TokensDTO) =>
  ok(res, { tokens }, "Token refreshed");

/**
 * 📌 Logout
 */
export const logoutResponse = (res: Response) =>
  ok(res, null, "Logged out");

/**
 * 📌 Forgot password
 */
export const forgotPasswordResponse = (res: Response, resetUrl?: string) =>
  ok(res, resetUrl ? { resetUrl } : null, "Password reset link sent");

/**
 * 📌 Reset password
 */
export const resetPasswordResponse = (res: Response) =>
  ok(res, null, "Password updated successfully");

/**
 * 📌 Change password
 */
export const passwordChangedResponse = (res: Response) =>
  ok(res, null, "Password changed successfully");

/**
 * 📌 Setup 2FA
 */
export const twoFASetupResponse = (res: Response, qr: string, secret: string) =>
  ok(res, { qr, secret }, "2FA setup initialized");

/**
 * 📌 Verify 2FA
 */
export const twoFAVerifyResponse = (
  res: Response,
  result: { success: boolean; twoFactorEnabled: boolean }
) => ok(res, result, "2FA verified");

/**
 * 📌 Disable 2FA
 */
export const twoFADisableResponse = (res: Response, data?: any) =>
  ok(res, data ?? null, "2FA disabled successfully");

/**
 * 📌 Auth error wrapper
 */
export const authError = (
  res: Response,
  message = "Authentication error",
  status = 400
) => fail(res, message, status);
