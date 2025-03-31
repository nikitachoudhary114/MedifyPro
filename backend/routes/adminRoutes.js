import express from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../controller/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);//done
router.post("/register", registerAdmin);//done
router.post("/logout", logoutAdmin);//done

export default router;