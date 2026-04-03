import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { upload } from "../../middleware/multer.js";
import {
  signup,
  verifyAccount,
  login,
  resendVerification,
  forgetPassword,
  resetPassword,
} from "./auth.service.js";
import { validation } from "../../utils/validation.js";
import {
  signupSchema,
  loginSchema,
  resendVerificationSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/signup",
  validation(signupSchema),
  upload.single("avatar"),
  signup,
);
router.get("/verify-email/:token", verifyAccount);
router.post(
  "/resend-verification",
  validation(resendVerificationSchema),
  resendVerification,
);
router.post("/login", validation(loginSchema), login);
router.post(
  "/forget-password",
  validation(forgetPasswordSchema),
  forgetPassword,
);
router.post("/reset-password", validation(resetPasswordSchema), resetPassword);

export default router;
