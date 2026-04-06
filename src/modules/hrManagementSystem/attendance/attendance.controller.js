import { Router } from "express";
import { checkIn, checkOut } from "./attendance.service.js";
import { auth } from "../../../middleware/auth.js";
import { authorize } from "../../../middleware/authorize.js";

let router = Router();

router.post("/check-in", auth, checkIn);
router.post("/check-out", auth, checkOut);

export default router;
