// auth.routes.ts
import { Router } from "express";
import * as controller from "@modules/auth/auth.controller";
import { validate } from "@middlewares/validate.middleware";
import { authenticate, authorize } from "@middlewares/authenticate.middleware";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@modules/auth/auth.dto";

const router = Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh", validate(refreshSchema), controller.refresh);
router.post("/logout", authenticate, controller.logout);

router.post("/forgot-password", validate(forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), controller.resetPassword);

// Two-Factor Authentication (2FA)
router.post("/2fa/setup", authenticate, controller.setup2FA);   // Genera secret + QR
router.post("/2fa/verify", authenticate, controller.verify2FA); // Verifica código TOTP
router.post("/2fa/disable", authenticate, controller.disable2FA); // Desactiva 2FA

// Ejemplo de endpoint protegido y con roles
router.get("/me", authenticate, authorize("ADMIN", "PATIENT"), (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
