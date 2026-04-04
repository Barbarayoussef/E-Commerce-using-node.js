import { Router } from "express";
import {
  addCategory,
  updateCategory,
  softDelete,
  getCategories,
  getActiveCategories,
  getSubcategoryForCategory,
} from "./category.service.js";
import { auth } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import { upload } from "../../middleware/multer.js";

let router = Router();
router.post("", auth, authorize("admin"), upload.single("image"), addCategory);
router.put(
  "/:id",
  auth,
  authorize("admin"),
  upload.single("image"),
  updateCategory,
);
router.delete("/:id", auth, authorize("admin"), softDelete);
router.get("", auth, authorize("admin"), getCategories);
router.get("/all", getActiveCategories);
router.get("/:id/subcategories", getSubcategoryForCategory);

export default router;
