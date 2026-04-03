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

const router = Router();

router.post("/signup", upload.single("avatar"), signup);
router.get("/verify-email/:token", verifyAccount);
router.post("/resend-verification", resendVerification);
router.post("/login", login);

export default router;
