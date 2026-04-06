import { Router } from "express";
import {
  createSubcategory,
  updateSubcategory,
  softDelete,
  getSubcategoryById,
} from "./subcategory.service.js";
import { auth } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import { validation } from "../../utils/validation.js";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
} from "./subcategory.validation.js";

const router = Router();
router.post(
  "",
  auth,
  authorize("admin"),
  validation(createSubcategorySchema),
  createSubcategory,
);
router.put(
  "/:id",
  auth,
  authorize("admin"),
  validation(updateSubcategorySchema),
  updateSubcategory,
);
router.delete("/:id", auth, authorize("admin"), softDelete);
router.get("/:id", auth, getSubcategoryById);
export default router;
