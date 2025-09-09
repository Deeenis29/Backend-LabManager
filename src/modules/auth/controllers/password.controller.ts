import { Request, Response } from "express";
import * as passwordService from "@modules/auth/services/password.service";
import { ok, fail } from "@modules/auth/responses/base.response";

/**
 * Change password (authenticated)
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!userId) return fail(res, "Unauthorized", 401);
    await passwordService.changePassword(userId, oldPassword, newPassword, req.ip, req.get("user-agent"));
    return ok(res, null, "Password changed successfully");
  } catch (err: any) {
    return fail(res, err.message || "Change password failed", 400);
  }
};
