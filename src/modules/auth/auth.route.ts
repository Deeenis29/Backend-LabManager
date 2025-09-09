import { Router } from "express";
import * as authController from "@modules/auth/controllers/auth.controller";
import * as twofactorController from "@modules/auth/controllers/twoFactor.controller";
import * as passwordController from "@modules/auth/controllers/password.controller";
import { authenticate } from "@modules/auth/middlewares/auth.middleware";
import { loginLimiter } from "@modules/auth/middlewares/rate.middleware";
import { validate } from "@modules/auth/middlewares/validate.middleware";
import { loginSchema } from "@modules/auth/dto/login.dto";
import { registerSchema } from "@modules/auth/dto/register.dto";
import { refreshSchema } from "@modules/auth/dto/refresh.dto";
import { forgotPasswordSchema } from "@modules/auth/dto/forgot.dto";
import { resetPasswordSchema } from "@modules/auth/dto/reset.dto";
import { verify2FASchema } from "@modules/auth/dto/two.factor";

const router = Router();

// Public
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Protected
router.post("/logout", authenticate, authController.logout);
router.post("/change-password", authenticate, passwordController.changePassword);

// 2FA endpoints (protected)
router.post("/2fa/setup", authenticate, twofactorController.setup2FA);
router.post("/2fa/verify", authenticate, validate(verify2FASchema), twofactorController.verify2FA);
router.post("/2fa/disable", authenticate, twofactorController.disable2FA);

export default router;
