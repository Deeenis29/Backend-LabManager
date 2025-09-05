import * as crypto from "crypto";

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");


export const generateToken = (length = 40) => crypto.randomBytes(length).toString("hex");