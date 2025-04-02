import express from "express";
import {
    allUsers,
    deleteUser,
    editProfile,
    getProfile,
    getSpecificUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../controller/userContoller.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../util/cloudinary.js";

const userRouter = express.Router();

userRouter.get("/", auth, allUsers); // done
userRouter.get("/profile", auth, getProfile); // done
userRouter.put("/profile", auth, upload.single("image"), editProfile); // Add image upload middleware
userRouter.get("/:userId", auth, getSpecificUser); // done
userRouter.delete("/:userId", auth, deleteUser); // done
userRouter.post("/register", registerUser); // done
userRouter.post("/login", loginUser); // done
userRouter.post("/logout", logoutUser); // done

export default userRouter;