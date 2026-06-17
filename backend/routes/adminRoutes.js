import express from "express";
import {
  adminDashboardDetails,
  doctorDashboardDetails,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  changeAdminPassword,
} from "../controller/adminController.js";
import { auth } from "../middleware/auth.js";
import { docAuth } from "../middleware/doctorAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin); //done
router.post("/register", registerAdmin); //done
router.post("/logout", logoutAdmin); //done
router.post("/adminDashboard", adminDashboardDetails); //done
router.post("/doctorDashboard", docAuth, doctorDashboardDetails); //done
router.post("/changePassword", changeAdminPassword); //done

export default router;
