import { Request, Response } from "express";
import * as service from "@modules/auth/auth.service";
import { ok, fail } from "@modules/auth/auth.response";

export const register = async (req: Request, res: Response) => {
  try {
    const data = await service.register(req.body, req.ip);
    return ok(res, data, 201);
  } catch (err: any) {
    return fail(res, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers['user-agent'] as string | undefined;
    const data = await service.login(req.body, req.ip, userAgent);

    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message, 401);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const data = await service.refresh(req.body.refreshToken, req.ip);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message, 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const userAgent = req.headers["user-agent"] as string | undefined;
    const data = await service.logout(userId, req.ip, userAgent);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message);
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"] as string | undefined;
    const data = await service.forgotPassword(req.body.email, req.ip, userAgent);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"] as string | undefined;
    const data = await service.resetPassword(req.body.token, req.body.newPassword, req.ip, userAgent);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message);
  }
};

export const setup2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // busca el email en DB
    const user = await service.getUserById(userId);
    if (!user) return fail(res, "User not found", 404);

    const data = await service.setup2FA(userId, user.email);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message);
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { token } = req.body;
    const data = await service.verify2FA(userId, token);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message);
  }
};

export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = await service.disable2FA(userId);
    return ok(res, data);
  } catch (err: any) {
    return fail(res, err.message);
  }
};