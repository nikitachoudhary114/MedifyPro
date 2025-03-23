import express from "express";
import { editProfile, getProfile, loginUser, logoutUser, registerUser } from "../controller/userContoller.js";
import { auth } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/profile',auth, getProfile);
userRouter.put('/profile',auth, editProfile);

export default userRouter;