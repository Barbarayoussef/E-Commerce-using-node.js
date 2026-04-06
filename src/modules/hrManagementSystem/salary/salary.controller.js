import { Router } from "express";
import {
  calculateSalary,
  markSalaryAsPaid,
  adjustSalary,
} from "./salary.service.js";
import { auth } from "../../../middleware/auth.js";
import { authorize } from "../../../middleware/authorize.js";

let router = Router();
router.post("/:id/salary/:month", auth, authorize("admin"), calculateSalary);
router.post(
  "/:id/salary/:month/pay",
  auth,
  authorize("admin"),
  markSalaryAsPaid,
);
router.put("/:id/salary/:month/adjust", auth, authorize("admin"), adjustSalary);

export default router;
