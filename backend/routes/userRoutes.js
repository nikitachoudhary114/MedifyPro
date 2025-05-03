import express from "express";
import {
    addEmergencyContact,
    allUsers,
    deleteUser,
    editProfile,
    getProfile,
    getSpecificUser,
    loginUser,
    logoutUser,
    razorpayPayment,
    registerUser,
    sos,
    updateAppointmentTimings,
    verifyRazorpay,
} from "../controller/userContoller.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../util/cloudinary.js";
import { docAuth } from "../middleware/doctorAuth.js";

const userRouter = express.Router();

userRouter.put('/emergency-contact', auth, addEmergencyContact);
userRouter.post("/sos-alert", auth, sos);

userRouter.get("/", allUsers); // done
userRouter.get("/profile", auth, getProfile); // done
userRouter.put("/profile", auth, upload.single("image"), editProfile); // Add image upload middleware
userRouter.get("/:userId", getSpecificUser); // done
userRouter.delete("/:userId", deleteUser); // done
userRouter.post("/register", registerUser); // done
userRouter.post("/login", loginUser); // done
userRouter.post("/logout", logoutUser); // done
userRouter.post("/payment",auth, razorpayPayment); // done
userRouter.post("/verify", auth, verifyRazorpay); // done
userRouter.put("/:appointmentId", auth, updateAppointmentTimings)




export default userRouter;