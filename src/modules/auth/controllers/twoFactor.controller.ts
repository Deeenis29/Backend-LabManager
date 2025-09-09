import { Request, Response } from "express";
import * as twofactorService from "@modules/auth/services/twofactor.service";
import * as repo from "@modules/auth/repo/auth.repo";
import { ok, fail } from "@modules/auth/responses/base.response";

/**
 * Setup 2FA: returns QR and secret (do not mark enabled yet)
 */
export const setup2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return fail(res, "Unauthorized", 401);

    // get email from DB (safer than reading from token payload)
    const user = await repo.findById(userId);
    if (!user) return fail(res, "User not found", 404);

    const { qr, secret } = await twofactorService.setup2FA(userId, user.email);
    // ⚠️ secret should only be returned in development/testing if needed
    return ok(res, { qr, secret }, "2FA setup initialized");
  } catch (err: any) {
    return fail(res, err.message || "2FA setup failed", 400);
  }
};

/**
 * Verify 2FA and enable
 */
export const verify2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;
    if (!userId) return fail(res, "Unauthorized", 401);
    if (!token) return fail(res, "token required", 400);

    const result = await twofactorService.verify2FA(userId, token);
    return ok(res, result, "2FA verified");
  } catch (err: any) {
    return fail(res, err.message || "2FA verification failed", 400);
  }
};

/**
 * Disable 2FA
 */
export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return fail(res, "Unauthorized", 401);
    const result = await twofactorService.disable2FA(userId);
    return ok(res, result, "2FA disabled");
  } catch (err: any) {
    return fail(res, err.message || "Disable 2FA failed", 400);
  }
};
