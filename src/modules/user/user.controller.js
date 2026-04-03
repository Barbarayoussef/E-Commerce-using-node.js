import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  softDelete,
  uploadAvatar,
} from "./user.service.js";
import { checkDeleteAccount } from "../../middleware/checkDeleteAccount.js";
import { upload } from "../../middleware/multer.js";
import { validation } from "../../utils/validation.js";
import { updateSchema } from "./user.validation.js";

const router = Router();
router.get("/profile", auth, checkDeleteAccount, getProfile);
router.put(
  "/profile",
  auth,
  checkDeleteAccount,
  validation(updateSchema),
  upload.single("avatar"),
  updateProfile,
);
router.delete("/profile", auth, checkDeleteAccount, softDelete);
router.post(
  "/upload-avatar",
  auth,
  checkDeleteAccount,
  upload.single("avatar"),
  uploadAvatar,
);

export default router;
