import jwt from "jsonwebtoken";
import { env } from "@config/env";

export type AppRole =
  | "ADMIN"
  | "DOCTOR"
  | "TECHNICIAN"
  | "RECEPTIONIST"
  | "PATIENT"
  | "QUALITY_MANAGER";

export interface JwtPayload {
  id: number;
  role: AppRole;
  iat?: number; // issued at (segundos)
  exp?: number; // expiry
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
