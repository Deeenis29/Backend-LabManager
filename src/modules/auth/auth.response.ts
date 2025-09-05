import { Response } from "express";

export const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

export const fail = (res: Response, message = "Unexpected error", status = 400, meta?: unknown) =>
  res.status(status).json({ success: false, message, ...(meta ? { meta } : {}) });
