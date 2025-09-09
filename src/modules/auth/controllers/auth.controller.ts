// src/modules/auth/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as loginService from "@modules/auth/services/login.service";
import * as registerService from "@modules/auth/services/register.service";
import * as refreshService from "@modules/auth/services/refresh.service";
import * as passwordService from "@modules/auth/services/password.service";
import * as twofactorService from "@modules/auth/services/twofactor.service";
import * as repo from "@modules/auth/repo/auth.repo";

import {
  loginResponse,
  registerResponse,
  refreshResponse,
  logoutResponse,
  forgotPasswordResponse,
  resetPasswordResponse,
  passwordChangedResponse,
  twoFASetupResponse,
  twoFAVerifyResponse,
  twoFADisableResponse,
  authError,
} from "@modules/auth/responses/auth.response";
import { ok, fail } from "@modules/auth/responses/base.response";

/**
 * 📌 Login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const ip = req.ip;
    const userAgent = req.get("user-agent") ?? undefined;

    const result = await loginService.login(req.body, ip, userAgent);
    // result: { user, tokens: { accessToken, refreshToken } }
    return loginResponse(res, result.tokens, result.user);
  } catch (err: any) {
    return authError(res, err.message || "Login failed", 400);
  }
};

/**
 * 📌 Register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const ip = req.ip;
    const userAgent = req.get("user-agent") ?? undefined;

    const user = await registerService.register(req.body, ip, userAgent);
    return registerResponse(res, user);
  } catch (err: any) {
    return authError(res, err.message || "Register failed", 400);
  }
};

/**
 * 📌 Refresh
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return fail(res, "refreshToken required", 400);

    const ip = req.ip;
    const userAgent = req.get("user-agent") ?? undefined;

    const data = await refreshService.refresh(refreshToken, ip, userAgent);
    return refreshResponse ? refreshResponse(res, data) : ok(res, data, "Token refreshed");
  } catch (err: any) {
    return fail(res, err.message || "Invalid refresh token", 401);
  }
};

/**
 * 📌 Logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return fail(res, "refreshToken required", 400);

    await refreshService.logout(refreshToken);
    return logoutResponse(res);
  } catch (err: any) {
    return authError(res, err.message || "Logout failed", 400);
  }
};

/**
 * 📌 Forgot password
 *
 * Nota: tu passwordService.forgotPassword actualmente sólo recibe (email: string)
 * y devuelve { message, resetUrl? } en dev. Por eso llamamos solo con email.
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return fail(res, "email required", 400);

    const result = await passwordService.forgotPassword(email);
    // result may be { message, resetUrl } in development
    return forgotPasswordResponse ? forgotPasswordResponse(res, result.resetUrl) : ok(res, result, "Password reset link sent");
  } catch (err: any) {
    return fail(res, err.message || "Forgot password failed", 400);
  }
};

/**
 * 📌 Reset password (con token)
 *
 * Nota: tu passwordService.resetPassword actualmente acepta (token, newPassword)
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return fail(res, "token and newPassword required", 400);

    await passwordService.resetPassword(token, newPassword);
    return resetPasswordResponse ? resetPasswordResponse(res) : ok(res, null, "Password updated successfully");
  } catch (err: any) {
    return fail(res, err.message || "Reset failed", 400);
  }
};

/**
 * 📌 Change password (requires login)
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) return fail(res, "Unauthorized", 401);
    if (!oldPassword || !newPassword) return fail(res, "oldPassword and newPassword required", 400);

    await passwordService.changePassword(userId, oldPassword, newPassword, req.ip, req.get("user-agent") ?? undefined);

    return passwordChangedResponse ? passwordChangedResponse(res) : ok(res, null, "Password changed successfully");
  } catch (err: any) {
    return fail(res, err.message || "Password change failed", 400);
  }
};

/**
 * 📌 Setup 2FA (generate QR + secret, not active yet)
 */
export const setup2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return fail(res, "Unauthorized", 401);

    const user = await repo.findById(userId);
    if (!user) return fail(res, "User not found", 404);

    const result = await twofactorService.setup2FA(userId, user.email);
    return twoFASetupResponse(res, result.qr, result.secret);
  } catch (err: any) {
    return fail(res, err.message || "2FA setup failed", 400);
  }
};

/**
 * 📌 Verify 2FA token and activate 2FA
 */
export const verify2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId) return fail(res, "Unauthorized", 401);
    if (!token) return fail(res, "Token required", 400);

    const result = await twofactorService.verify2FA(userId, token); 

    return twoFAVerifyResponse(res, result); //
  } catch (err: any) {
    return fail(res, err.message || "2FA verification failed", 400);
  }
};


/**
 * 📌 Disable 2FA
 */
export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return fail(res, "Unauthorized", 401);

    await twofactorService.disable2FA(userId);
    return twoFADisableResponse(res);
  } catch (err: any) {
    return fail(res, err.message || "2FA disable failed", 400);
  }
};
