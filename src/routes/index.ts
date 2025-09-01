import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export { router as routes };
