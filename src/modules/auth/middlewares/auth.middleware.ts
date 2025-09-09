import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "@modules/auth/utils/jwt"; // ajusta path a tu config
import { prisma } from "@/config/db"; // path a tu prisma client
import { fail } from "@modules/auth/responses/base.response";

/**
 * Extiende Request para user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { iat?: number; exp?: number };
    }
  }
}

/**
 * Auth middleware
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return fail(res, "No token provided", 401);

  const token = header.split(" ")[1]!;
  try {
    const payload = verifyAccessToken(token);

    // check db user exist, active and lastPasswordChange
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { lastPasswordChange: true, isActive: true },
    });

    if (!dbUser || !dbUser.isActive) return fail(res, "Account disabled", 401);

    if (dbUser.lastPasswordChange && (payload as any).iat && (payload as any).iat * 1000 < dbUser.lastPasswordChange.getTime()) {
      return fail(res, "Token expired due to password change", 401);
    }

    // attach payload
    req.user = payload as any;
    return next();
  } catch (err: any) {
    return fail(res, "Invalid or expired token", 401);
  }
};
