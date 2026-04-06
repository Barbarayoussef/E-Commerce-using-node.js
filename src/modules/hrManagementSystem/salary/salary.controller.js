import { Router } from "express";
import {
  calculateSalary,
  markSalaryAsPaid,
  adjustSalary,
} from "./salary.service.js";

let router = Router();
router.post("/:id/salary/:month", calculateSalary);
router.post("/:id/salary/:month/pay", markSalaryAsPaid);
router.put("/:id/salary/:month/adjust", adjustSalary);

export default router;
