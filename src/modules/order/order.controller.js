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

let router = Router();
router.post("/orders/checkout", auth, checkoutCart);
router.get("/orders", auth, viewMyOrders);
router.get("/orders/:id", auth, viewOrderDetails);
router.get("/admin/orders", auth, authorize("admin"), viewAllOrders);
router.patch(
  "/admin/orders/:id/status",
  auth,
  authorize("admin"),
  updateOrderStatus,
);
export default router;
