import { Router } from "express";
import {
  addItemToCart,
  viewCart,
  removeItem,
  updateQuantity,
  clearCart,
} from "./cart.service.js";
import { auth } from "../../middleware/auth.js";

let router = Router();
router.post("", auth, addItemToCart);
router.get("", auth, viewCart);
router.put("/:productId", auth, updateQuantity);
router.delete("/:productId", auth, removeItem);
router.delete("", auth, clearCart);
export default router;
