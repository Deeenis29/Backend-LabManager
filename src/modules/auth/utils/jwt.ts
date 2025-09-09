import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "@config/env";
import { roleEnum } from "@modules/auth/dto/shared.enums";

/**
 * 📌 Payload mínimo dentro del JWT
 */

export interface JwtPayload {
  id: number;
  role: z.infer<typeof roleEnum>;
  iat?: number;
  exp?: number;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30m" });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
