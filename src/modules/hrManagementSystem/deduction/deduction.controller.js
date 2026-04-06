import e, { Router } from "express";
import {
  addDeduction,
  getStaffDeductions,
  updateDeduction,
  removeDeduction,
} from "./deduction.service.js";
import { auth } from "../../../middleware/auth.js";
import { authorize } from "../../../middleware/authorize.js";
import { validation } from "../../../utils/validation.js";
import {
  addDeductionSchema,
  updateDeductionSchema,
} from "./deduction.validation.js";
let router = Router();

router.post(
  "/:id/deductions",
  auth,
  authorize("admin"),
  validation(addDeductionSchema),
  addDeduction,
);
router.get("/:id/deductions", auth, authorize("admin"), getStaffDeductions);
router.put(
  "/:id/deductions/:deductionId",
  auth,
  authorize("admin"),
  validation(updateDeductionSchema),
  updateDeduction,
);
router.delete(
  "/:id/deductions/:deductionId",
  auth,
  authorize("admin"),
  removeDeduction,
);

export default router;
