import { Router } from "express";
import {
  addProduct,
  updateProducts,
  softDelete,
  updateStock,
  getAllProducts,
  getProductById,
  getProductOfCategory,
  getProductsOfSubcategory,
} from "./product.service.js";
import { auth } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import { upload } from "../../middleware/multer.js";

let router = Router();
router.post(
  "/admin/products",
  auth,
  authorize("admin"),
  upload.array("images"),
  addProduct,
);
router.put(
  "/admin/products/:id",
  auth,
  authorize("admin"),
  upload.array("images"),
  updateProducts,
);
router.delete("/admin/products/:id", auth, authorize("admin"), softDelete);
router.put("/admin/products/:id/stock", auth, authorize("admin"), updateStock);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:categoryId", getProductOfCategory);
router.get("/products/subcategory/:categoryId", getProductsOfSubcategory);
export default router;
