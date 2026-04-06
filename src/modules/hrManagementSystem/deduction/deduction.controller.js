import e, { Router } from "express";
import {
  addDeduction,
  getStaffDeductions,
  updateDeduction,
  removeDeduction,
} from "./deduction.service";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authorize";

let router = Router();

router.post("/:id/deductions", auth, authorize("admin"), addDeduction);
router.get("/:id/deductions", auth, authorize("admin"), getStaffDeductions);
router.put(
  "/:id/deductions/:deductionId",
  auth,
  authorize("admin"),
  updateDeduction,
);
router.delete(
  "/:id/deductions/:deductionId",
  auth,
  authorize("admin"),
  removeDeduction,
);

export default router;
