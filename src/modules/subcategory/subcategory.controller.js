import { Router } from "express";
import {
  createSubcategory,
  updateSubcategory,
  softDelete,
  getSubcategoryById,
} from "./subcategory.service.js";
import { auth } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();
router.post("", auth, authorize("admin"), createSubcategory);
router.put("/:id", auth, authorize("admin"), updateSubcategory);
router.delete("/:id", auth, authorize("admin"), softDelete);
router.get("/:id", auth, getSubcategoryById);
export default router;
