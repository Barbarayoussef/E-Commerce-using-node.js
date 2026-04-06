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
import { validation } from "../../utils/validation.js";
import {
  addProductSchema,
  updateProductSchema,
  updateStockSchema,
} from "./product.validation.js";

let router = Router();
router.post(
  "/admin/products",
  auth,
  authorize("admin"),
  (req, _, next) => {
    req.cloudinaryFolder = "products";
    next();
  },
  upload.array("images"),
  validation(addProductSchema),
  addProduct,
);
router.put(
  "/admin/products/:id",
  auth,
  authorize("admin"),
  (req, _, next) => {
    req.cloudinaryFolder = "products";
    next();
  },
  upload.array("images"),
  validation(updateProductSchema),
  updateProducts,
);

router.delete("/admin/products/:id", auth, authorize("admin"), softDelete);
router.put(
  "/admin/products/:id/stock",
  auth,
  authorize("admin"),
  validation(updateStockSchema),
  updateStock,
);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:categoryId", getProductOfCategory);
router.get("/products/subcategory/:subcategoryId", getProductsOfSubcategory);
export default router;
