import { Router } from "express";
import {
  createSubcategory,
  updateSubcategory,
  softDelete,
} from "./subcategory.service.js";

const router = Router();
router.post("", createSubcategory);
router.put("/:id", updateSubcategory);
router.delete("/:id", softDelete);
export default router;
