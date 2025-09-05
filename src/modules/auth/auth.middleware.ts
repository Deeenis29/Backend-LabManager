import { prisma } from "@config/db";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload, AppRole } from "@config/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = header.split(" ")[1]!;
  try {
    const payload = verifyAccessToken(token);

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { lastPasswordChange: true, isActive: true },
    });

    console.log("🔑 Incoming token:", token);
    console.log("Decoded payload:", payload);

    if (!dbUser || !dbUser.isActive) {
      return res.status(401).json({ success: false, message: "Account disabled" });
    }

    if (dbUser.lastPasswordChange && payload.iat && payload.iat * 1000 < dbUser.lastPasswordChange.getTime()) {
      return res.status(401).json({ success: false, message: "Token expired due to password change" });
    }

    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  
};

export const authorize =
  (...roles: AppRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: "Forbidden" });
    return next();
  };
