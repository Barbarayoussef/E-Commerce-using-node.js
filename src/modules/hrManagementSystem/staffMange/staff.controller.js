import { Router } from "express";
import {
  addStaffMember,
  getAllStaff,
  getStaffDetails,
  updateStaffInfo,
  softDeleteStaff,
} from "./staff.service.js";
import { auth } from "../../../middleware/auth.js";
import { authorize } from "../../../middleware/authorize.js";

let router = Router();
router.post("/staff", auth, authorize("admin"), addStaffMember);
router.get("/staff", auth, authorize("admin"), getAllStaff);
router.get("/staff/:id", auth, authorize("admin"), getStaffDetails);
router.put("/staff/:id", auth, authorize("admin"), updateStaffInfo);
router.delete("/staff/:id", auth, authorize("admin"), softDeleteStaff);
export default router;
