import { Router } from "express";
import {
  checkoutCart,
  viewMyOrders,
  viewOrderDetails,
  viewAllOrders,
  updateOrderStatus,
} from "./order.service.js";
import { auth } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import { validation } from "../../utils/validation.js";
import { checkoutSchema, updateOrderStatusSchema } from "./order.validation.js";

let router = Router();
router.post("/orders/checkout", auth, validation(checkoutSchema), checkoutCart);
router.get("/orders", auth, viewMyOrders);
router.get("/orders/:id", auth, viewOrderDetails);
router.get("/admin/orders", auth, authorize("admin"), viewAllOrders);
router.patch(
  "/admin/orders/:id/status",
  auth,
  authorize("admin"),
  validation(updateOrderStatusSchema),
  updateOrderStatus,
);
export default router;
